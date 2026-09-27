"use client";

import "client-only";

import type { ChangeEvent } from "react";

import { Button, Input, Spinner } from "@heroui/react";
import { useState } from "react";

import { getUserMe, saveTokenCookie } from "./actions";
import DelayedRedirect from "./DelayedRedirect";
import AlertTriangle from "../ui/svg/AlertTriangle";
import CheckCircle from "../ui/svg/CheckCircle";

export default function Home() {
  const [token, setToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  let subtext = null;

  if (loading) {
    subtext = (
      <div className="flex h-8 flex-row items-center justify-center gap-x-4">
        <Spinner className="size-8" />
        <p className="text-md text-foreground">Loading Account Details...</p>
        <div className="size-8" />
      </div>
    );
  } else if (success) {
    subtext = (
      <div className="flex h-8 flex-row items-center justify-center gap-x-4">
        <CheckCircle className="text-success" size={18} />
        <p className="text-md text-foreground">Successfully Logged In!</p>
        <DelayedRedirect path="/channels/me/home" />
      </div>
    );
  } else if (error) {
    subtext = (
      <div className="flex h-8 flex-row items-center justify-center gap-x-4">
        <AlertTriangle className="text-danger" size={18} />
        <p className="text-md text-foreground">{error}</p>
        <div className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col items-center justify-between gap-y-14 px-8 py-24">
      <div className="size-1" />

      <div className="flex flex-col items-center justify-center gap-y-14">
        <div />

        <div className="flex flex-col items-center justify-center gap-y-8">
          <h1 className="text-center text-5xl font-bold">
            Discord Bot Token{" "}
            <span className="bg-linear-150 from-blue-600 to-indigo-400 bg-clip-text text-transparent">
              Viewer
            </span>
          </h1>
          <p className="text-pretty-balance text-foreground w-full max-w-lg text-center text-lg">
            Paste your Discord bot token below to make API calls on your behalf
            to the Discord API. The token must be stored in cookies and accessed
            by the server to bypass CORS policies.
          </p>
        </div>

        <div className="flex h-14 w-full max-w-xl flex-row gap-1 gap-x-5">
          <Input
            className="h-full flex-1"
            placeholder="Token..."
            type="password"
            value={token}
            onChange={onChange}
          />
          <Button
            className="h-full rounded-xl"
            isDisabled={token.length === 0}
            variant="outline"
            onClick={onClick}
          >
            Submit
          </Button>
        </div>

        {subtext}
      </div>

      <div className="flex flex-row items-center justify-center">
        <p className="text-pretty-balance text-foreground max-w-lg text-center text-sm">
          To run this project locally, please visit this GitHub repository and
          follow the README.md file to start the nextjs server.
        </p>
      </div>
    </div>
  );

  function onChange(element: ChangeEvent<HTMLInputElement, HTMLInputElement>) {
    setToken(element.target.value);
  }

  async function onClick() {
    setLoading(true);

    const response = await getUserMe(token);

    if (response.success) {
      setError("");
      setSuccess(true);
      await saveTokenCookie(token, response.data);
    } else {
      setError("Something went wrong");
      setSuccess(false);
    }

    setLoading(false);
  }
}
