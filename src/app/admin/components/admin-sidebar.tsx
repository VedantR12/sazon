import Link from "next/link";

export function AdminSidebar() {
  return (

    <div className="w-[220px] bg-white border-r h-screen p-6">

      <h2 className="text-2xl font-bold mb-8">
        Admin
      </h2>

      <nav className="flex flex-col gap-4">

        <Link href="/admin">
          Dashboard
        </Link>

        <Link href="/admin/submissions">
          Submissions
        </Link>

        <Link href="/admin/vendors">
          Vendors
        </Link>

        <Link href="/admin/reviews">
          Reviews
        </Link>

      </nav>

    </div>
  );
}