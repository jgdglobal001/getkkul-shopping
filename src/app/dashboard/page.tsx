import { redirect } from "next/navigation";

export default function DashboardRouter() {
  // Redirect to account page by default
  redirect("/account");
}
