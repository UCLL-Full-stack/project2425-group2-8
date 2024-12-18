import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTable } from "@/types/auth";

interface UserOverviewTableProps {
  data: UserTable[];
}

export function UserOverviewTable({ data }: UserOverviewTableProps) {
  return (
    <div className="rounded-md border border-gray-300">
      <Table className="min-w-full divide-y divide-gray-200">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Username
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              First Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Name
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </TableHead>
            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Roles
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((user) => (
              <TableRow key={user.id} className="hover:bg-gray-100">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.username}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.firstName}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.lastName}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.role}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
              >
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
