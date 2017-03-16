$(function(){
var $_container = $('#_grid');

		$_container.imagesLoaded(function(){
	        $_container.masonry({        
	            itemSelector: '.grid-item',
	            columnWidth: 364,
	            singleMode: true,
	            //transitionDuration: 0
	    });
	});


    $('.have-sub').on('click', function (e) {
        e.preventDefault();
        $(this).siblings('li').removeClass('active').find('.sub').hide();
        return $(this).toggleClass('active').find('.sub').toggle();
    });


});


