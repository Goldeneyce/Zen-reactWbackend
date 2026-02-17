"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ComponentProps, PropsWithChildren } from "react";

export const AlertDialog = Dialog.Root;
export const AlertDialogTrigger = Dialog.Trigger;

export const AlertDialogContent = ({ children, ...props }: PropsWithChildren<ComponentProps<typeof Dialog.Content>>) => (
  <Dialog.Content {...props}>{children}</Dialog.Content>
);

export const AlertDialogHeader = ({ children }: PropsWithChildren) => (
  <div>{children}</div>
);

export const AlertDialogFooter = ({ children }: PropsWithChildren) => (
  <div>{children}</div>
);

export const AlertDialogTitle = ({ children, ...props }: PropsWithChildren<ComponentProps<typeof Dialog.Title>>) => (
  <Dialog.Title {...props}>{children}</Dialog.Title>
);

export const AlertDialogDescription = ({ children, ...props }: PropsWithChildren<ComponentProps<typeof Dialog.Description>>) => (
  <Dialog.Description {...props}>{children}</Dialog.Description>
);

export const AlertDialogCancel = ({ children, ...props }: PropsWithChildren<ComponentProps<typeof Dialog.Close>>) => (
  <Dialog.Close {...props}>{children}</Dialog.Close>
);

export const AlertDialogAction = ({ children, ...props }: PropsWithChildren<ComponentProps<typeof Dialog.Close>>) => (
  <Dialog.Close {...props}>{children}</Dialog.Close>
);
