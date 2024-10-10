import { TableCell, TableRow } from "@/components/ui/table";

export const EmptyPlaceholder = () => {
    return (
        <TableRow>
            <TableCell className="font-medium">
                <p className="text-gray-500">No videos found</p>
            </TableCell>
        </TableRow>
    );
};
