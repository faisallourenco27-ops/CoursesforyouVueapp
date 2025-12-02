new Vue({
    el: '#app',
    data: {
        sortBy: 'lesson', // default sort by lesson name
        sortOrder: 'asc',
        cart: [],
        showCartPage: false,
        showAdminPage: false,
        isAdmin: false,
        adminUsername: '',
        adminPassword: '',
        adminError: '',
        checkoutName: '',
        checkoutPhone: '',
        orderSubmitted: false,
        showOrderConfirmation: false,
        confirmedOrderDetails: null,
        showLessonModal: false,
        selectedLesson: null,
        searchQuery: '',
        apiBaseUrl: 'https://expressjs-flj.onrender.com/api', // Update with backend URL
        lessons: []
    },

    created() {
        this.fetchLessons();
    },

    computed: {
            sortedLessons() {
        // First filter by search query
        let filtered = this.lessons;

        if (this.searchQuery.trim() !== '') {
            const q = this.searchQuery.trim().toLowerCase();
            filtered = this.lessons.filter(lesson => {
                return (
                    lesson.lesson.toLowerCase().includes(q) ||
                    lesson.location.toLowerCase().includes(q)
             );
            });
     }

        // Then sort the filtered list
        const sorted = [...filtered].sort((a, b) => {
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
        console.log(' Fetching lessons from:', `${this.apiBaseUrl}/lessons`);
        const response = await fetch(`${this.apiBaseUrl}/lessons`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(' Received data:', data);
        
        this.lessons = data.map(lesson => ({
            id: lesson.id,                     // <-- backend gives this already
            lesson: lesson.topic,              // UI-friendly name
            location: lesson.location,
            price: lesson.price,
            spaces: lesson.space,              // backend: space → frontend: spaces
            icon: this.getLessonImage(lesson.topic),
            synopsis: this.getLessonSynopsis(lesson.topic, lesson.location)
        }));

        console.log(' Lessons transformed successfully:', this.lessons);

    } catch (error) {
        console.error('Error fetching lessons:', error);
        alert('Failed to load lessons from server. Please check if the backend is running.\n\nError: ' + error.message);
    }
},


        getLessonImage(topic) {
            // Map lesson topics to their image URLs
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
            return imageMap[topic] || 'https://via.placeholder.com/220';
        },

        getLessonSynopsis(topic, location) {
            const place = location ? ` at our ${location} centre` : '';

             const map = {
                'Further Maths': `Build a strong foundation in advanced topics like algebra, calculus and problem-solving${place}, perfect for students aiming for top grades.`,
                'Art & Design': `Explore drawing, painting and digital design${place}, while building a creative portfolio and learning how to express your ideas visually.`,
                'Boxing': `Learn boxing fundamentals${place}, including footwork, punching technique and fitness drills in a safe, structured environment.`,
                'Karate': `Develop discipline, confidence and self-defence skills${place} through traditional karate techniques, partner work and fun drills.`,
                'Football': `Improve your passing, shooting and teamwork${place} with game-based sessions that build both skills and match awareness.`,
                'Drama': `Gain confidence on stage${place} through acting exercises, script work and group performances in a supportive atmosphere.`,
                'Music': `Learn to read music, develop rhythm and perform with others${place}, whether you’re just starting out or building existing skills.`,
                'Basketball': `Work on dribbling, shooting and defence${place} with structured drills and small-sided games designed to boost your confidence on court.`,
                'Coding': `Get hands-on with real programming concepts${place}, building small projects that introduce you to web, game or app development.`,
                'Cooking': `Learn essential kitchen skills${place}, from knife safety to tasty recipes, and gain confidence preparing simple dishes yourself.`
            };

        // Fallback if a topic isn't in the map:
        return map[topic] || `Learn ${topic}${place} in a supportive, engaging course designed to help you grow.`;
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

        // Change quantity in cart
        increaseQuantity(cartItem) {
            const lesson = this.lessons.find(l => l.id === cartItem.id);
            if (lesson && lesson.spaces > 0) {
                lesson.spaces--;        // taking one more seat
                cartItem.quantity++;   // add one to cart
            }
        },

        decreaseQuantity(cartItem) {
            if (cartItem.quantity > 1) {
                const lesson = this.lessons.find(l => l.id === cartItem.id);
                if (lesson) {
                    lesson.spaces++;   // free up a seat
                }
                cartItem.quantity--;   // remove one from cart
            } else {
                // if quantity would go to 0, just remove the item
                this.removeFromCart(cartItem);
            }
        },

        
        viewCart() {
        this.showAdminPage = false;   // make sure admin is hidden
        this.showCartPage = true;
        this.orderSubmitted = false;
       },
        
        backToLessons() {
            this.showCartPage = false;
            this.checkoutName = '';
            this.checkoutPhone = '';
        },
       
        // B. POST - Save new order to backend 
        async saveOrder(orderData) {
            try {
                console.log('📝 Sending order data:', orderData);
                const response = await fetch(`${this.apiBaseUrl}/orders`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData)
                });
                
                const responseText = await response.text();
                console.log('Response received:', responseText);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const savedOrder = JSON.parse(responseText);
                console.log(' Order saved successfully:', savedOrder);
                return savedOrder;
                
            } catch (error) {
                console.error(' Error saving order:', error);
                throw error;
            }
        },

        // C. PUT - Update lesson spaces in backend 
        async updateLessonSpaces(lessonId, newSpaces) {
            try {
                console.log(` Updating lesson ${lessonId} to ${newSpaces} spaces`);
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
                
                const updatedLesson = await response.json();
                console.log(' Lesson spaces updated:', updatedLesson);
                return updatedLesson;
                
            } catch (error) {
                console.error(' Error updating lesson spaces:', error);
                throw error;
            }
        },

        // Checkout integrates all three fetch operations
        async checkout() {
            if (!this.isCheckoutEnabled) return;
            
            try {
                console.log('Starting checkout process...');
                
                // Take snapshot of cart BEFORE any async operations
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
                
                // B. POST - Save the order to database
                console.log(' Saving order...');
                const savedOrder = await this.saveOrder(orderData);
                
                // C. PUT - Update spaces for each lesson in the cart
                console.log('Updating lesson spaces...');
                const updatePromises = cartSnapshot.map(item => {
                    const lesson = this.lessons.find(l => l.id === item.id);
                    if (lesson) {
                        return this.updateLessonSpaces(item.id, lesson.spaces);
                    }
                });
                
                await Promise.all(updatePromises.filter(p => p !== undefined));
                console.log(' All lesson spaces updated');
                
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
                
                console.log('Order confirmation details:', this.confirmedOrderDetails);
                
                // Show confirmation message FIRST
                this.showOrderConfirmation = true;
                
                // Clear form and cart
                this.cart = [];
                this.checkoutName = '';
                this.checkoutPhone = '';
                
                // Hide confirmation and return to lessons after delay
                setTimeout(() => {
                    this.showOrderConfirmation = false;
                    this.showCartPage = false;
                    
                    // Refresh lessons from backend to get updated spaces
                    this.fetchLessons();
                }, 9000);
                
            } catch (error) {
                alert('There was an error processing your order. Please try again.\n\nError: ' + error.message);
                console.error(' Checkout error:', error);
            }
        },
                // 🔹 ADMIN: open/close panel
        openAdmin() {
            this.showCartPage = false;
            this.showAdminPage = true;
        },

        closeAdmin() {
            this.showAdminPage = false;
            this.isAdmin = false;
            this.adminUsername = '';
            this.adminPassword = '';
            this.adminError = '';
        },

        // 🔹 ADMIN: simple front-end login
        submitAdminLogin() {
            const validUser = 'admin';
            const validPass = 'admin123';

            if (this.adminUsername.trim() === validUser && this.adminPassword === validPass) {
                this.isAdmin = true;
                this.adminError = '';
                this.adminPassword = '';
            } else {
                this.isAdmin = false;
                this.adminError = 'Invalid username or password';
            }
        },

        // ADMIN: save spaces for a lesson
        saveAdminSpaces(lesson) {
            const newSpaces = Number(lesson.spaces);

            if (isNaN(newSpaces) || newSpaces < 0) {
                alert('Spaces must be a non-negative number.');
                return;
            }

            this.updateLessonSpaces(lesson.id, newSpaces)
                .then(() => {
                    alert(`Updated spaces for ${lesson.lesson} to ${newSpaces}`);
                })
                .catch(error => {
                    console.error('Error updating lesson spaces from admin page:', error);
                    alert('Failed to update lesson spaces. Please try again.');
                });
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