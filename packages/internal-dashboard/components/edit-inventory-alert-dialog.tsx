import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function EditInventoryAlertDialog({ formId }: { formId: string }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="mt-4 h-11 w-full rounded-2xl" type="button">
                    Save changes
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Apply product changes?</AlertDialogTitle>
                    <AlertDialogDescription>These updates will be saved directly to the inventory record and shown the next time this product is loaded.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction form={formId} type="submit">
                        Confirm save
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
