'use strict';
console.log('clik');

$('#updateButton').click(function() {
    console.log('clik');
    $(this).next().toggle();
})