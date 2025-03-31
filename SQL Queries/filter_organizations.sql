CREATE OR REPLACE FUNCTION public.filter_organizations(filters jsonb)
 RETURNS SETOF organizations_main
 LANGUAGE plpgsql
AS $function$
DECLARE
    filter_key text;
    filter_values jsonb;
    query text;
    operator text;
    filter_type text;
    value_str text;
    nested_path text[];
    nested_field text;
BEGIN
    -- Start with base query
    query := 'SELECT * FROM organizations_main WHERE true';

    -- Iterate through each filter
    FOR filter_key, filter_values IN SELECT * FROM jsonb_each(filters)
    LOOP
        -- Get the filter type from the filters table
        SELECT type INTO filter_type
        FROM filters
        WHERE field = filter_key;

        -- Split the filter key to handle nested paths (e.g., 'major_projects.location')
        nested_path := string_to_array(filter_key, '.');
        
        -- Handle different filter types
        CASE filter_type
            WHEN 'object_array' THEN
                -- Handle object arrays with key-value filtering
                query := query || format(
                    ' AND (
                        CASE WHEN jsonb_typeof(metadata->%L) = ''array'' THEN
                            EXISTS (
                                SELECT 1 FROM jsonb_array_elements(metadata->%L) obj
                                WHERE obj ? %L AND LOWER(obj->>%L) = ANY(array[%s])
                            )
                        ELSE
                            metadata->%L ? %L AND LOWER((metadata->%L)->>%L) = ANY(array[%s])
                        END
                    )',
                    filter_key,
                    filter_key,
                    (filter_values->>'key'),
                    (filter_values->>'key'),
                    (SELECT string_agg(quote_literal(LOWER(value::text)), ',') FROM jsonb_array_elements_text(filter_values->'values')),
                    filter_key,
                    (filter_values->>'key'),
                    filter_key,
                    (filter_values->>'key'),
                    (SELECT string_agg(quote_literal(LOWER(value::text)), ',') FROM jsonb_array_elements_text(filter_values->'values'))
                );
            WHEN 'array' THEN
                IF array_length(nested_path, 1) > 1 THEN
                    -- Handle nested array objects
                    nested_field := nested_path[array_length(nested_path, 1)];
                    query := query || format(
                        ' AND EXISTS (
                            SELECT 1 FROM jsonb_array_elements(CASE 
                                WHEN jsonb_typeof(metadata->%L) = ''array'' THEN metadata->%L
                                ELSE jsonb_build_array(metadata->%L)
                            END) obj
                            WHERE LOWER(obj->>%L) = ANY(array[%s])
                        )',
                        nested_path[1],
                        nested_path[1],
                        nested_path[1],
                        nested_field,
                        (SELECT string_agg(quote_literal(LOWER(value::text)), ',') FROM jsonb_array_elements_text(filter_values))
                    );
                ELSE
                    -- For regular array types
                    query := query || format(
                        ' AND metadata->>%L IS NOT NULL AND (
                            CASE 
                                WHEN jsonb_typeof(metadata->%L) = ''array'' THEN
                                    metadata->%L ?| array[%s]
                                ELSE
                                    metadata->>%L = ANY(array[%s])
                            END
                        )',
                        filter_key,
                        filter_key,
                        filter_key,
                        (SELECT string_agg(quote_literal(value::text), ',') FROM jsonb_array_elements_text(filter_values)),
                        filter_key,
                        (SELECT string_agg(quote_literal(value::text), ',') FROM jsonb_array_elements_text(filter_values))
                    );
                END IF;

            WHEN 'number' THEN
                -- For numeric types, cast the metadata value to numeric for comparison
                query := query || format(
                    ' AND (metadata->>%L)::numeric = ANY(array[%s]::numeric[])',
                    filter_key,
                    (SELECT string_agg(value::text, ',') FROM jsonb_array_elements_text(filter_values))
                );

            WHEN 'boolean' THEN
                -- For boolean types, cast the metadata value to boolean
                value_str := (SELECT value::text FROM jsonb_array_elements_text(filter_values) LIMIT 1);
                query := query || format(
                    ' AND (metadata->>%L)::boolean = %L::boolean',
                    filter_key,
                    value_str
                );

            ELSE
                -- For string types and others, use direct equality comparison
                query := query || format(
                    ' AND metadata->>%L = ANY(array[%s])',
                    filter_key,
                    (SELECT string_agg(quote_literal(value::text), ',') FROM jsonb_array_elements_text(filter_values))
                );
        END CASE;
    END LOOP;

    -- Execute the dynamic query
    RETURN QUERY EXECUTE query;
END;
$function$;