import { redirect } from "next/navigation";

export default function UserDashboard() {
  // Redirect to account page
  redirect("/account");
}
