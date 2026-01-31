export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-slate-950">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-brand-primary dark:border-slate-800 dark:border-t-brand-primary" />
        </div>
    );
}
