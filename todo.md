- [] pricing page have plans for week/month/year
- [] user dashboard option to change photo and password
- [X] stripe integration for subscriptions
- [X] fetch data from google sheets only new; 
- [X] if orderId prefix is already added it should return an error
- [] user can use multiple google sheet id because every sheet represent a product orders
- [] stripe checkout per Month after 3 Month or per year
- [] also implement youcan gateway
- [] admin panel show sheetId for different plans or hide it
- [X] while register api create stripe user 
- [] encrypt password
- [] Check stripe when subscription is cancelled at the end of month


- [] Admin will manage subscription plan , subscription pricing , subscription naming from admin panel
- [] admin can control cronJobs timing , every user can control timing until admin disable feature user can choose if they want to run this every 1min or every 1h or 24h depend on their plan , admin can disable this feature from all users or from normal plan or premium etc or he can control what they can choose example normal plan 1h and up , premium 30min and up
- [] admin panel to control pages , and pricing plans , and users if we have to add or change pricing plans
- [] admin can control like giving free trail for a specific plan for like 7days
- [] admin can control that on plan that how many api or secret kyes of CIA can user enter

Cronjobs control, Imagine you are a user you have in your dashboard the page where we write our inputs and page where we control cronjobs so lets say you are a user with normal plan and on this plan you have 1h minimum for cronjobs so in cronjobs page you can make checking time 1h or more and you have start and stop button if you want to stop the cronjobs , now lets imagine another user have premium plan with 1min minimum and more than 1 sheet so in cron jobs page after he create his sheets lets say 3 sheet he will see them on cronjobs page and he can control everyone of them (every sheet have start and stop button and a timer) i hope u get the idea for users 

For admin panel in cronjobs page you can disable the cronjobs on users dashboard (i mean if u disable the restricted and not have access to their cron jobs page ) and after that you can control all plans or specific plans and set their time or u can controll every user and make them don’t have access lets say u are a premium user with lot of sheet and im the admin in my admin panel i can choose u in the cronjob page when i click on u i can see all sheets u have and control their timer by making them more than 1min or stopping the cronjobs or whatever i want , so in admin panel we can controll cronjobs with plan and user and their sheets i hope u get this part also

After we have user page which we can manage every user or make a user admin or moderator or subscriber or unsubscriber and change password and email or any of his information 

Then youcan pay integration
Then page builder where we can edit add page or menu by text or code anyway i guess u already have idea about this 

Then payements setup page where we inpute our information for stripe account and youcan pay 

Then setting page where we can edit logo keywords favicon rules (that nedeed on register page ) etc like and setting on admin panels i guess there is lot of exemple 

And for dashboard page i just want to see stats of the app total user subscribers non subscribers normal plan pro plan premium and a chart etc like any dashboard page 

For user dashboard a docs page which will give them instructions how to use the app (we can control it from admin panel if we wan to add more instructions) and a setting where he can add profil image change password (for email he need to verify before changing) anyway like any setting 

Then language page where we can add or delete language or edited 

Last i dont know if we our api on this app if yes just a documentation for it 

Tell me if im missing something please ?

When we implemented all of this i will give my next step like bot feature and other things it would be a different order and new order in fiverr because the features on this new order we didn’t discuss it so to be fair to u it will be new complete order with a price we agreed but for sure it will not take time like now because we already have the basics
After you read this tell me what your thoughts and if im missing anything
Or if you don’t understand something