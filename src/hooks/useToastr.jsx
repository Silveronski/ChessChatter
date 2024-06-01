import toastr from "toastr";

export default function useToastr(ToastType, text, timeout = 3000) {
    const options = {
        timeOut: timeout,
        extendedTimeOut: 0, 
        closeButton: true, 
        positionClass: "toast-top-right", 
        tapToDismiss: true,
        preventDuplicates: true,  
    };

    switch (ToastType) {
        case 'error':
            toastr.error(text, options);
            break;
        case 'success':
            toastr.success(text, options);
            break;
        case 'info':
            toastr.info(text, options);
            break;
        case 'warning':
            toastr.warning(text, options);
            break;
        default:
            toastr.info(text, options);
            break;
    }
}