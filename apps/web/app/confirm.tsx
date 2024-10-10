import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React, { useCallback, useContext, useState } from "react";

type TConfirmParams = {
    title?: React.ReactNode;
    description?: React.ReactNode;
    continueText: React.ReactNode;
    onContinue?: () => void;
};

const ConfirmationContext = React.createContext<
    (params: TConfirmParams) => Promise<boolean>
>(async () => false);

type TResultFn = (value: boolean) => void;

export const ConfirmProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState<React.ReactNode>(null);
    const [description, setDescription] = useState<React.ReactNode>(null);
    const [continueText, setContinueText] = useState<React.ReactNode>(null);
    const [resolve, setResolve] = useState<TResultFn | null>(null);

    const confirm = useCallback(
        async ({
            title,
            description,
            continueText,
            onContinue,
        }: TConfirmParams) => {
            setTitle(title);
            setDescription(description);
            setContinueText(continueText);
            setIsOpen(true);
            return new Promise<boolean>((res) => {
                setResolve(() => res);
            }).then((result) => {
                if (result && onContinue) {
                    onContinue();
                }
                return result;
            });
        },
        []
    );

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open && resolve) {
            resolve(false);
            setResolve(null);
        }
    };

    const handleClickContinue = () => {
        setIsOpen(false);
        if (resolve) {
            resolve(true);
            setResolve(null);
        }
    };

    return (
        <ConfirmationContext.Provider value={confirm}>
            {children}
            <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {title ?? "Are you sure?"}
                        </AlertDialogTitle>
                        {description && (
                            <AlertDialogDescription>
                                {description}
                            </AlertDialogDescription>
                        )}
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClickContinue}>
                            {continueText}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ConfirmationContext.Provider>
    );
};

export const useConfirm = () => useContext(ConfirmationContext);
