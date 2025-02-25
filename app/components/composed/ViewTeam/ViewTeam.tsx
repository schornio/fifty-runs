"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atomics/Button";

const ViewTeam = ({ teamName }: { teamName: string }) => {
  const router = useRouter();

  return (
    <Button
      type="button"
      onClick={() => router.push(`/team/${teamName}`)}
      className="bg-congress-blue-900 text-white px-4 py-2 rounded-full"
    >
      Team ansehen
    </Button>
  );
};

export default ViewTeam;
