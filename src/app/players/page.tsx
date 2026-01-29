import { redirect } from 'next/navigation';

// Players list is now part of team pages
// Redirect to teams page where users can view rosters
export default function PlayersPage() {
  redirect('/teams');
}
