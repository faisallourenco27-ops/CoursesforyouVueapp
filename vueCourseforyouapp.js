new Vue({
    el: '#app',
    data: {
        sortBy: 'lesson',
        sortOrder: 'asc',
        cart: [],
        showCartPage: false,
        checkoutName: '',
        checkoutPhone: '',
        showOrderConfirmation: false,
        confirmedOrderDetails: {
            orderNumber: '',
            name: '',
            phone: '',
            items: [],
            total: 0
        },
        showLessonModal: false,
        selectedLesson: null,
        apiBaseUrl: 'https://expressjs-flj.onrender.com/api',

        lessons: [
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

    created() {
        this.fetchLessons();
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
        async fetchLessons() {
            try {
                console.log('Fetching lessons from:', `${this.apiBaseUrl}/lessons`);
                const response = await fetch(`${this.apiBaseUrl}/lessons`);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                console.log('Received data:', data);
                
                // If API returns data, use it. Otherwise keep hardcoded lessons.
                if (data && data.length > 0) {
                    this.lessons = data.map(lesson => ({
                        id: lesson.id,
                        lesson: lesson.topic || lesson.lesson,
                        location: lesson.location,
                        price: lesson.price,
                        spaces: lesson.space || lesson.spaces,
                        icon: lesson.image || this.getLessonImage(lesson.topic || lesson.lesson),
                        synopsis: lesson.description || `Learn ${lesson.topic || lesson.lesson} at our ${lesson.location} location.`
                    }));
                }
                
            } catch (error) {
                console.error('Error fetching lessons:', error);
                // Keep hardcoded lessons as fallback
            }
        },

        getLessonImage(topic) {
            const imageMap = {
                'Further Maths': 'https://media.istockphoto.com/id/1866121335/photo/physics-and-mathematics.webp?b=1&s=612x612&w=0&k=20&c=ND9gyyqbrA8GknNpbo4-Oy9vVKzaSJ6P3L2JvqYTYO0=',
                'Art & Design': 'https://media.istockphoto.com/id/1372126412/photo/multiracial-students-painting-inside-art-room-class-at-school-focus-on-girl-face.webp?b=1&s=612x612&w=0&k=20&c=3KPEFUIEjH4IqegohqPiZmqieezUl4yMoLgHjhoxzQY=',
                'Boxing': 'https://cdn.pixabay.com/photo/2012/10/25/23/32/boxing-62867_1280.jpg',
                'Karate': 'https://cdn.pixabay.com/photo/2022/01/28/07/39/marshall-6973880_1280.jpg',
                'Football': 'https://cdn.pixabay.com/photo/2014/10/14/20/24/ball-488717_1280.jpg',
                'Drama': 'https://cdn.pixabay.com/photo/2022/07/30/01/18/actor-7352882_1280.jpg',
                'Music': 'https://cdn.pixabay.com/photo/2020/06/29/19/26/piano-5353974_1280.jpg',
                'Basketball': 'https://cdn.pixabay.com/photo/2017/10/29/21/06/tahincioglu-basketball-super-league-2900843_1280.jpg',
                'Coding': 'https://cdn.pixabay.com/photo/2015/12/04/14/05/code-1076536_1280.jpg',
                'Cooking': 'https://cdn.pixabay.com/photo/2022/06/02/18/22/ramen-7238665_1280.jpg'
            };
            return imageMap[topic] || 'https://via.placeholder.com/400x300?text=Lesson';
        },

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
        },

        backToLessons() {
            this.showCartPage = false;
            this.showOrderConfirmation = false;
            this.checkoutName = '';
            this.checkoutPhone = '';
        },

        async saveOrder(orderData) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
                
            } catch (error) {
                console.error('Error saving order:', error);
                throw error;
            }
        },

        async updateLessonSpaces(lessonId, newSpaces) {
            try {
                const response = await fetch(`${this.apiBaseUrl}/lessons/${lessonId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ space: newSpaces })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return await response.json();
                    
            } catch (error) {
                console.error('Error updating lesson spaces:', error);
                throw error;
            }
        },

        async checkout() {
            if (!this.isCheckoutEnabled) return;
            
            try {
                console.log('Starting checkout process...');
                
                // Create snapshots of current data
                const cartSnapshot = [...this.cart];
                const totalSnapshot = this.cartTotal;
                const nameSnapshot = this.checkoutName;
                const phoneSnapshot = this.checkoutPhone;
                
                // Prepare order data for backend
                const orderData = {
                    name: nameSnapshot,
                    phoneNumber: phoneSnapshot,
                    lessonIDs: cartSnapshot.map(item => item.id),
                    spaces: cartSnapshot.reduce((total, item) => total + item.quantity, 0)
                };
                
                // Save the order to database
                console.log('Saving order...');
                const savedOrder = await this.saveOrder(orderData);
                
                // Update spaces for each lesson in the cart
                console.log('Updating lesson spaces...');
                const updatePromises = cartSnapshot.map(item => {
                    const lesson = this.lessons.find(l => l.id === item.id);
                    if (lesson) {
                        return this.updateLessonSpaces(item.id, lesson.spaces);
                    }
                });
                
                await Promise.all(updatePromises.filter(p => p !== undefined));
                console.log('All lesson spaces updated');
                
                // Generate order number for display
                const orderNumber = savedOrder.order?._id || savedOrder._id || 'ORD' + Date.now();
                
                // Store confirmation details using snapshots
                this.confirmedOrderDetails = {
                    orderNumber: orderNumber,
                    name: nameSnapshot,
                    phone: phoneSnapshot,
                    items: cartSnapshot,
                    total: totalSnapshot
                };
                
                console.log('Order confirmation details set');
                
                // Show confirmation message
                this.showOrderConfirmation = true;
                
                // Clear form and cart
                this.cart = [];
                this.checkoutName = '';
                this.checkoutPhone = '';
                
                console.log('Checkout completed successfully');
                
            } catch (error) {
                console.error('Checkout error:', error);
                alert('There was an error processing your order. Please try again.\n\nError: ' + error.message);
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