(function ($) {

    $(document).ready(function(){
        $('.adv_box_').viewportChecker({
            classToAdd: 'inView',
            offset:'30%'
        });

        $('.page-section').viewportChecker({
            classToAdd: 'inView',
            offset:'30%'
        });

        if($(window).width() < 1025){
          $('.page-section,.adv_box_').viewportChecker({ 
            classToAdd: 'inView',
            offset:'0%'

        });
        }

        $('body').addClass('is-loaded');

    });





})(jQuery);
