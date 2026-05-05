import { X } from 'lucide-react';

export function Modal({ isOpen, title, children, onClose }) {
    if(!isOpen) return null;

    return(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-2xl rounded-lg border border-border bg-card shadow-xl">
                <div className="flex items-center justify-between border-b border-border p-4">
                    <h2 className="text-lg font-semibold text-primary">{title}</h2>
                    <button
                        type='button'
                        onClick={onClose}
                        className='rounded-md border border-border p-2 hover:bg-slate-100'
                        aria-label='Fechar modal'
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className='max-h-[75vh] overflow-y-auto p-4'>
                    {children}
                </div>
            </div>
        </div>
    );
}