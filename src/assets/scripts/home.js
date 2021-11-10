(function ($) {
    $(document).ready(function(){
        if($(window).width() > 767){
            $('.home-section').viewportChecker({
                classToAdd: 'inView',
                offset: '50%'
            });
        }else{
            $('.home-section').viewportChecker({
                classToAdd: 'inView',
                offset: '30%'
            });
        }
        $('[data-inner-view]').viewportChecker({
            classToAdd: 'innerView'
        });

        $('body').addClass('is-loaded');

        $('[data-model-box]').fancybox({
            modal: true,
        })

    });
})(jQuery);
