"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/shared/ui";

export function LessonActions({
  lessonId,
  isCompleted,
  isSaved,
  allowMutations
}: {
  lessonId: string;
  isCompleted: boolean;
  isSaved: boolean;
  allowMutations: boolean;
}) {
  const router = useRouter();
  const [completed, setCompleted] = useState(isCompleted);
  const [saved, setSaved] = useState(isSaved);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function updateProgress(nextCompleted: boolean) {
    if (!allowMutations) {
      setMessage("Sign in with Supabase enabled to persist progress.");
      return;
    }

    const response = await fetch("/api/lesson-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, completed: nextCompleted })
    });

    if (!response.ok) {
      setMessage("Could not update lesson progress.");
      return;
    }

    setCompleted(nextCompleted);
    setMessage(nextCompleted ? "Lesson marked complete." : "Lesson marked incomplete.");
    startTransition(() => router.refresh());
  }

  async function updateSaved(nextSaved: boolean) {
    if (!allowMutations) {
      setMessage("Sign in with Supabase enabled to save lessons.");
      return;
    }

    const response = await fetch("/api/saved-lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lessonId, saved: nextSaved })
    });

    if (!response.ok) {
      setMessage("Could not update saved lesson state.");
      return;
    }

    setSaved(nextSaved);
    setMessage(nextSaved ? "Lesson saved." : "Lesson removed from saved lessons.");
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex flex-col items-end gap-3">
      <div className="flex flex-wrap justify-end gap-3">
        <Button
          type="button"
          variant={completed ? "default" : "secondary"}
          disabled={isPending}
          onClick={() => updateProgress(!completed)}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {completed ? "Completed" : "Mark complete"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={isPending}
          onClick={() => updateSaved(!saved)}
        >
          {saved ? (
            <BookmarkCheck className="mr-2 h-4 w-4" />
          ) : (
            <Bookmark className="mr-2 h-4 w-4" />
          )}
          {saved ? "Saved" : "Save lesson"}
        </Button>
      </div>
      {message ? <p className="text-sm text-zinc-500">{message}</p> : null}
    </div>
  );
}
