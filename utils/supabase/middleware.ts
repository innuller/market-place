import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { signOutAction } from "@/app/actions";

export const updateSession = async (request: NextRequest) => {
  // This `try/catch` block is only here for the interactive tutorial.
  // Feel free to remove once you have Supabase connected.
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // This will refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const user = await supabase.auth.getUser();
    // console.log("middleware,tsx Users: ",user);
    

    // protected routes
    if (request.nextUrl.pathname.startsWith("/protected") && user.error) {
      return NextResponse.redirect(new URL("/users/signin", request.url));
    }
    if (request.nextUrl.pathname.startsWith("/forgot-password") && user.error) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    // if (request.nextUrl.pathname.startsWith("/registration-form") && !user.error ) {     
    //   return NextResponse.redirect(new URL("/chat/company", request.url));
    // }

    if (request.nextUrl.pathname.startsWith("/companies/signin") && !user.error) {
      // await signOutAction();
      return NextResponse.redirect(new URL("/chat/company", request.url));
    }
    if (request.nextUrl.pathname.startsWith("/companies/signup") && !user.error) {
      return NextResponse.redirect(new URL("/chat/company", request.url));
    }
    if (request.nextUrl.pathname.startsWith("/users/signin") && !user.error) {
      return NextResponse.redirect(new URL("/protected", request.url));
    }
    if (request.nextUrl.pathname.startsWith("/users/signup") && !user.error) {
      return NextResponse.redirect(new URL("/protected", request.url));
    }

    if (request.nextUrl.pathname.startsWith("/saved-list") && user.error) {
      return NextResponse.redirect(new URL("/users/signin", request.url));
    }
    // if (request.nextUrl.pathname.startsWith("/registration-form") && user.error) {
    //   return NextResponse.redirect(new URL("/companies/signin", request.url));
    // }
    // if (request.nextUrl.pathname.startsWith("/registration-form") && !user.error && user.data.user.user_metadata.user_type != "company") {
    //   await signOutAction();
    //   return NextResponse.redirect(new URL("/companies/signup", request.url));
    // }

    // if (request.nextUrl.pathname.startsWith("/registration-form") && !user.error && user.data.user.user_metadata.user_type == "company") {
    //   return NextResponse.redirect(new URL("/chat/company", request.url));
    // }

    if (request.nextUrl.pathname === "/landing-page" && !user.error) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (request.nextUrl.pathname === "/users/signin" && !user.error) {
      return NextResponse.redirect(new URL("/protected", request.url));
    }

    if (request.nextUrl.pathname === "/users/signup" && !user.error) {
      return NextResponse.redirect(new URL("/protected", request.url));
    }

    if (request.nextUrl.pathname === "/auth" && !user.error) {
      return NextResponse.redirect(new URL("/protected", request.url));
    }

    // if (request.nextUrl.pathname.startsWith("/admin") && user.error) {
    //   return NextResponse.redirect(new URL("/users/signin", request.url));
    // }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps. asasasasas
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
