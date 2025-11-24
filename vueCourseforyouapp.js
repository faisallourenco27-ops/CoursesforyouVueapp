new Vue({
    el: '#app',
    data: {
        sortBy: 'lesson', //default for sort by:, means lesson will appear first 
        sortOrder: 'asc', //default for order:, means ascend appears first 
        cart: [], //array to hold added lessons to cart 
        showCartPage: false,
        checkoutName: '', //name input field for checkout form
        checkoutPhone: '', //phone input field for checkout form 
        orderSubmitted: false, //boolean to indicate if order has been submitted
        showOrderConfirmation: false,  // boolean to control order confirmation visibility
        confirmedOrderDetails: null, // holds details of the confirmed order 
        showLessonModal: false, // boolean to control lesson info modal visibility
        selectedLesson: null,   // holds the currently selected lesson for modal display 

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
    },
    computed: {
    sortedLessons() {
        const sorted = [...this.lessons].sort((a, b) => {
            let aValue = a[this.sortBy];
            let bValue = b[this.sortBy];
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            if (aValue < bValue) return this.sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return this.sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    },
    cartCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
        },
        isNameValid() {
            return /^[A-Za-z\s]+$/.test(this.checkoutName.trim());
        },
        isPhoneValid() {
            return /^\d+$/.test(this.checkoutPhone.trim());
        },
        isCheckoutEnabled() {
            return this.isNameValid && this.isPhoneValid && this.cart.length > 0;
        },
        cartTotal() {
            return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        }


    },
    methods: {
        addToCart(lesson) {
            if (lesson.spaces > 0) {
            lesson.spaces--;
                const existingItem = this.cart.find(item => item.id === lesson.id);
                if (existingItem) {
                existingItem.quantity++;
                } else {
                    this.cart.push({
                    id: lesson.id,
                    lesson: lesson.lesson,
                    location: lesson.location,
                    price: lesson.price,
                    quantity: 1
                    });
                }
            }
        },
        removeFromCart(cartItem) {
            const lesson = this.lessons.find(l => l.id === cartItem.id);
            if (lesson) {
                lesson.spaces += cartItem.quantity;
            }
            this.cart = this.cart.filter(item => item.id !== cartItem.id);
        },
        viewCart() {
            this.showCartPage = true;
            this.orderSubmitted = false;
        },
        backToLessons() {
            this.showCartPage = false;
            this.checkoutName = '';
            this.checkoutPhone = '';
        },

        checkout() {
    if (this.isCheckoutEnabled) {
        // Generate order confirmation details
        const orderNumber = 'ORD' + Date.now();
        this.confirmedOrderDetails = {
            orderNumber: orderNumber,
            name: this.checkoutName,
            phone: this.checkoutPhone,
            items: [...this.cart],
            total: this.cartTotal
        };
        
        // Show confirmation message
        this.showOrderConfirmation = true;
        
        // Clear cart and reset after a delay
        setTimeout(() => {
            this.cart = [];
            this.checkoutName = '';
            this.checkoutPhone = '';
            this.showCartPage = false;
            this.showOrderConfirmation = false;
        }, 9000);
        }
    },
      
        showLessonInfo(lesson) {
                this.selectedLesson = lesson;
                this.showLessonModal = true;
        },
    

        hideLessonInfo() {
                this.showLessonModal = false;
                this.selectedLesson = null;
        }

    }
});