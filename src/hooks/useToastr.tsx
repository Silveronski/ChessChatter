import toastr from "toastr";

type ToastrDisplayMethod = 'error' | 'success' | 'info' | 'warning';
     
type ToastrType = {
    (text: string,
    ToastType?: ToastrDisplayMethod,
    timeout?: number): void
}

export const useToastr: ToastrType = (text, ToastType, timeout): void => {
    const options = {
        timeOut: timeout || 3000,
        extendedTimeOut: 0, 
        closeButton: true, 
        positionClass: "toast-top-right", 
        tapToDismiss: true,
        preventDuplicates: true,  
    };

    switch (ToastType) {
        case 'error':
            toastr.error(text, '', options);
            break;
        case 'success':
            toastr.success(text, '', options);
            break;
        case 'info':
            toastr.info(text, '', options);
            break;
        case 'warning':
            toastr.warning(text, '', options);
            break;
        default:
            toastr.info(text, '', options);
            break;
    }
}