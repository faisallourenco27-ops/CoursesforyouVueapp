new Vue({
    el: '#app',
    data: {
        lessons: [
            {
                id: 1,
                lesson: 'Further Maths',
                location: 'Hendon',
                price: 50,
                spaces: 5,
                icon: 'https://media.istockphoto.com/id/1866121335/photo/physics-and-mathematics.webp',
                synopsis: 'An advanced course in mathematical concepts.'
            },
            {
                id: 2,
                lesson: 'Art & Design',
                location: 'Hendon',
                price: 55,
                spaces: 5,
                icon: 'https://media.istockphoto.com/id/1372126412/photo/multiracial-students-painting.webp',
                synopsis: 'Explore creativity through various mediums.'
            }
            
        ]
    }
});