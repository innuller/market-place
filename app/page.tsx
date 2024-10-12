import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";

export default async function Index() {
  return (
    <>
      {/* <Hero /> */}
      <main className="flex-1 flex flex-col gap-6 px-4 justify-center items-center h-screen">
        {/* <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />} */}
        <Link href={"/NewHome"} className="bg-gradient-to-br from-green-400 to-secondary text-black font-bold py-2 px-4 rounded">
        Click to Go to New Redesigned Home Page
        </Link>
      </main>
    </>
  );
}
