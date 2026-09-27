import type { RESTGetAPIChannelMessagesResult } from "discord-api-types/v10";

import { cn } from "@heroui/react";
import ms from "ms";
import NextImage from "next/image";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import Images from "@/app/config/images";
import { useLocale } from "@/app/ui/providers/LocaleProvider";
import CornerUpRight from "@/app/ui/svg/CornerUpRight";

export default function MessageSegment({
  message,
  hideAuthor,
}: React.PropsWithChildren<{
  message: RESTGetAPIChannelMessagesResult[number];
  hideAuthor: boolean;
}>) {
  const locale = useLocale();

  const profilePicture = (
    <NextImage
      fill
      alt={message.author.username}
      sizes="(max-width: 512px) 100vw, 512px"
      src={Images.User.AvatarUrl(message.author)}
    />
  );

  let time;
  if (
    new Date(message.timestamp).getDate() === new Date().getDate() - 1 ||
    // Overflow for the first day of the month. If the date does not match,
    // the date must be from the last day of the previous month
    (new Date().getDate() === 1 &&
      new Date(message.timestamp).getDate() !== new Date().getDate())
  ) {
    time = `Yesterday at ${new Date(message.timestamp).toLocaleString(locale, {
      hour: "numeric",
      minute: "numeric",
    })}`;
  } else if (
    new Date(message.timestamp).getTime() <
    new Date().getTime() - ms("1 day")
  ) {
    time = `${new Date(message.timestamp).toLocaleString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })} ${new Date(message.timestamp).toLocaleString(locale, {
      hour: "numeric",
      minute: "numeric",
    })}`;
  } else {
    time = `${new Date(message.timestamp).toLocaleString(locale, {
      hour: "numeric",
      minute: "numeric",
    })}`;
  }

  const authorName = (
    <div className="mt-1 flex flex-row items-baseline justify-start gap-2">
      <h3 className="text-lg font-semibold">
        {message.author.global_name ?? message.author.username}
      </h3>
      <time className="text-muted text-xs tracking-wide">{time}</time>
    </div>
  );

  let content;
  if (
    message.content === message.embeds[0]?.url &&
    message.embeds[0].thumbnail?.proxy_url
  ) {
    content = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={message.id}
        alt={message.embeds[0].url}
        className="max-h-96 max-w-lg rounded-md"
        src={message.embeds[0].thumbnail.proxy_url}
      />
    );
  } else if (message.content.length > 0) {
    content = (
      <div className="text-pretty wrap-break-word">
        <ReactMarkdown
          components={reactMarkdownComponents}
          remarkPlugins={[remarkBreaks, remarkGfm]}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    );
  } else if (message.attachments.length > 0) {
    const attachments = [];

    for (const attachment of message.attachments) {
      attachments.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={attachment.id}
          alt={attachment.filename}
          className="max-h-96 max-w-lg rounded-md"
          src={attachment.url}
        />
      );
    }

    content = attachments;
  } else {
    content = <p className="text-danger">UNKNOWN CONTENT - NOT RENDERED</p>;
  }

  let replyReference;
  if (message.referenced_message) {
    hideAuthor = false;

    replyReference = (
      <div className="mb-2 flex flex-row items-end justify-start gap-3 pl-5">
        <CornerUpRight className="text-muted size-5 shrink-0" />
        <div className="flex min-w-0 flex-row items-center justify-start gap-2">
          <div className="relative size-5 shrink-0 overflow-hidden rounded-full">
            <NextImage
              fill
              alt={message.referenced_message.author.username}
              loading="lazy"
              sizes="(max-width: 256px) 100vw, 256px"
              src={Images.User.AvatarUrl(message.referenced_message.author)}
            />
          </div>

          <div className="flex min-w-0 flex-row items-baseline justify-start gap-2">
            <h4 className="text-md text-muted shrink-0 font-semibold text-nowrap">
              {message.referenced_message.author.global_name ??
                message.referenced_message.author.username}
            </h4>
            <p className="truncate">{message.referenced_message.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      key={message.id}
      className={cn(
        "hover:bg-default-hover flex flex-col py-1 pr-12 pl-6",
        !hideAuthor && "mt-6 pt-2"
      )}
    >
      {replyReference}

      <div className="flex flex-row items-start justify-start gap-6">
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-full",
            !hideAuthor ? "size-14" : "w-14"
          )}
        >
          {!hideAuthor && profilePicture}
        </div>

        <div className="min-w-0">
          {!hideAuthor && authorName}
          {content}
        </div>
      </div>
    </div>
  );
}

const reactMarkdownComponents = {
  a: ({
    className,
    children,
    ...props
  }: React.HTMLProps<HTMLAnchorElement>) => (
    <a {...props} className={cn(className, "text-blue-400 hover:underline")}>
      {children}
    </a>
  ),
  strong: ({ className, ...props }: React.HTMLProps<HTMLElement>) => (
    <strong {...props} className={cn(className, "font-bold")} />
  ),
  em: ({ className, ...props }: React.HTMLProps<HTMLElement>) => (
    <em {...props} className={cn(className, "italic")} />
  ),
};
