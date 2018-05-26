
    $('.pullChevron').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    $(document).click(function(e) {
        var sidebar = $("#sidebar, .pullChevron");
        console.log(sidebar);
        if (!sidebar.is(e.target) && sidebar.has(e.target).length === 0) {//length of sidebar>pullchevron is greater than 0, a window object//
          sidebar.removeClass('active')
        }
    });


    
    $(document).ready(function () {

        $('#list-items').html(localStorage.getItem('listItems'));
          
        $('.add-items').submit(function(event) 
        {
          event.preventDefault();
      
          var item = $('#todo-list-item').val();
      
          if(item) 
          {
            $('#list-items').append("<li><input class='checkbox' type='checkbox'/>" + item + "<a class='remove'>x</a><hr></li>");
            
            localStorage.setItem('listItems', $('#list-items').html());
            
            $('#todo-list-item').val("");
          }
          
        });
      
        $(document).on('change', '.checkbox', function() 
        {
          if($(this).attr('checked')) 
          {
            $(this).removeAttr('checked');
          } 
          else 
          {
            $(this).attr('checked', 'checked');
          }
      
          $(this).parent().toggleClass('completed');
          
          localStorage.setItem('listItems', $('#list-items').html());
        });
      
        $(document).on('click', '.remove', function() 
        {
          $(this).parent().remove();
          
          localStorage.setItem('listItems', $('#list-items').html());
        });
      
      });