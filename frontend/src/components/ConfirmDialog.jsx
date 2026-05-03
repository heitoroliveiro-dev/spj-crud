export function ConfirmDialog({
    isOpen,
    title = 'Confirmar ação',
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    onConfirm,
    onCancel,
    isSubmitting = false,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl">
                <h2 className="text-lg font-semibold text-primary">{title}</h2>
                <p className="mt-3 text-sm text-slate-600">{message}</p>
                <div className="mt-6 flex justify-end gap-3"> 
                    <button
                        type="button"
                        onClick={onCancel}
                        disable={isSubmitting}
                        className="button-secondary"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disable={isSubmitting}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                    >
                        {isSubmitting ? 'Aguarde...' : confirmLabel}    
                    </button>
                </div>
            </div>
        </div>
    );

}