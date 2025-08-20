import { Metadata } from "next";
import CDNavbarUserProfileSSC from "@/components/complex/header/server_side/CDUserProfile.server";
import CDNavbarClientSide from "@/components/complex/header/CDNavbar.client";
import CDSideBar from "@/components/complex/sidebar/CDSidebar.client";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    default: "Complex Dashboard HQ",
    template: "%s - Complex Dashboard HQ",
  },
  description: "Complex Dashboard structure setting up",
};

export default function ComplexLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex transform flex-col sm:transform-gpu md:transform-none">
      {/* client side navbar holding server component and accept props */}
      <header>
        <CDNavbarClientSide customProp="this is where you can pass props">
          <CDNavbarUserProfileSSC />
        </CDNavbarClientSide>
      </header>

      {/* main structure */}
      <main className="flex w-full flex-row">
        {/* static sidebar */}
        <>
          <CDSideBar
            customProps={{
              linksList: [
                { link: "/leads", text: "Leads" },
                { link: "/clients", text: "Clients" },
                { link: "/tasks", text: "Tasks" },
              ],
            }}
          />
        </>

        {/* main pages render here */}
        <>
          <Suspense fallback={"complex loadding..."}>{children}</Suspense>
        </>
      </main>
    </section>
  );
}
