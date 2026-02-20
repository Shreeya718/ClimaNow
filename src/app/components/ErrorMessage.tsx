import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-4 bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
      <p className="text-red-700">{message}</p>
    </div>
  );
}
