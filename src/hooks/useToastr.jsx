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

    if (ToastType === 'error') {
        toastr.error(text, options);                             
    }
    else if (ToastType === 'success') {
        toastr.success(text, options);
    }
    else if (ToastType === 'info') {
        toastr.info(text, options);
    }
    else if (ToastType === 'warning') {
        toastr.warning(text, options);
    }
    else {
        toastr.info(text, options);
    }
}