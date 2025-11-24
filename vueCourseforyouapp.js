new Vue({
    el: '#app',
    data: {
         lessons: [ //array of lesson objects with details
            {
                id: 1,
                lesson: 'Further Maths',
                location: 'Hendon',
                price: 50,
                spaces: 5,
                icon: 'https://media.istockphoto.com/id/1866121335/photo/physics-and-mathematics.webp?b=1&s=612x612&w=0&k=20&c=ND9gyyqbrA8GknNpbo4-Oy9vVKzaSJ6P3L2JvqYTYO0=',
                synopsis: 'An advanced course in mathematical concepts and techniques beyond standard curriculum.'
            },
            {
                id: 2,
                lesson: 'Art & Design',
                location: 'Hendon',
                price: 55,
                spaces: 5,
                icon: 'https://media.istockphoto.com/id/1372126412/photo/multiracial-students-painting-inside-art-room-class-at-school-focus-on-girl-face.webp?b=1&s=612x612&w=0&k=20&c=3KPEFUIEjH4IqegohqPiZmqieezUl4yMoLgHjhoxzQY=',
                synopsis: 'Explore creativity through various mediums including painting, sculpture, and digital art.'
            },
            {
                id: 3,
                lesson: 'Boxing',
                location: 'Barnet',
                price: 55,
                spaces: 5,
                icon: 'https://cdn.pixabay.com/photo/2012/10/25/23/32/boxing-62867_1280.jpg',
                synopsis: 'Learn the fundamentals of boxing, including techniques, fitness, and discipline.'
            },
            {
                id: 4,
                lesson: 'Karate',
                location: 'Barnet',
                price: 40,
                spaces: 5,
                icon: 'https://cdn.pixabay.com/photo/2022/01/28/07/39/marshall-6973880_1280.jpg',
                synopsis: 'A traditional martial arts course focusing on self-defense, discipline, and physical fitness.'
            },
            {
                id: 5,
                lesson: 'Football',
                location: 'Harrow',
                price: 35,
                spaces: 5,
                icon: 'https://cdn.pixabay.com/photo/2014/10/14/20/24/ball-488717_1280.jpg',
                synopsis: 'Develop your football skills, teamwork, and strategy in this engaging course.'
            },
            {
                id: 6,
                lesson: 'Drama',
                location: 'Harrow',
                price: 30,
                spaces: 5,
                icon: 'https://cdn.pixabay.com/photo/2022/07/30/01/18/actor-7352882_1280.jpg',
                synopsis: 'Enhance your acting skills, stage presence, and confidence through various drama exercises.'
            },
            {
                id: 7,
                lesson: 'Music',
                location: 'Barnet',
                price: 60,
                spaces: 5,
                icon: 'https://cdn.pixabay.com/photo/2020/06/29/19/26/piano-5353974_1280.jpg',
                synopsis: 'Learn to play musical instruments, understand music theory, and develop your musical talents.'
            },
            {
                id: 8,
                lesson: 'Basketball',
                location: 'Hendon',
                price: 40,
                spaces: 5,
                icon: 'https://cdn.pixabay.com/photo/2017/10/29/21/06/tahincioglu-basketball-super-league-2900843_1280.jpg',
                synopsis: 'Improve your basketball skills, teamwork, and game strategies in this dynamic course.'
            },
            {
                id: 9,
                lesson: 'Coding',
                location: 'Harrow',
                price: 45,
                spaces: 5,
                icon: 'https://cdn.pixabay.com/photo/2015/12/04/14/05/code-1076536_1280.jpg',
                synopsis: 'Learn programming languages, software development, and problem-solving techniques.'
            },
            {
                id: 10,
                lesson: 'Cooking',
                location: 'Barnet',
                price: 35,
                spaces: 5,
                icon: 'https://cdn.pixabay.com/photo/2022/06/02/18/22/ramen-7238665_1280.jpg',
                synopsis: 'Discover culinary skills, recipes, and cooking techniques from various cuisines.' 
            }
        ]
    }
});