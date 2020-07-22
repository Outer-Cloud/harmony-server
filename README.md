```
Routes:/api
	Auth /auth
		Post: /login
		Delete: /logout/:token
		Delete /logout
		
	User /user
		Post: /             //account creation
		Get /:id		//get user specified by user
		Me /me

		Account /account
			Get: /        //retrieve account info
			Put /       //update account info
			Delete: /   //delete account
			
		Server /server
			Get /   //retrieves server icon/name/ids
			Delete /:sid   //leave server with id
			Post /:sid      //Join server with id
			
		Channel /channel
			Get /   //retrieves DMs
			Delete /:cid  //leave DM with id
			
		Relationships /relationships
			Blocked Users  /block
				Get /   //retrieves all blocked users
				Post/  //block user with id, id in body
				Delete/:uid //unblock user with id
			Friends  /friends
				Get /     //retrieves all friends
				Delete /:uid    //unfriend id
			Requests /
				Get /      //retrieves all friend requests
				Post / 	  //send a friend request
				Actions /:rid
				Delete /decline/   //decline friend request
				Delete /accept/	    //accept friend request
				
	Server /server
		Post /     //create server
		Actions /:id
			Get /         //retrieve the icon and name of server with id
			Delete /    //delete server
			
			Channel /channel
				Get /     //retrieve list of channels
				Put /     //add a channel
				Delete /:chid     //delete channel with id

			Category /category
				Get /    //get the list of category
				Put /    //add a category
				Actions /:caid
					Put /channel/:cid    //add/move channel to category
					Delete /channel/:cid   //delete channel from category
					Delete /     //delete category
				
			Member /member
				Get /         //get list of users
				Actions /:uid
					Get /     //get user profile from server
					Put /     //add user to list user of server
	
	Channels /channel
		Post /            //create a channel
		Actions /:id
			Get /        //retrieve channel with id
			Delete /   //delete channel
			Put /        //update channel info
			
			Messages message/
				Get /        //get message with channel id
	
	Messages /message
		Post /           // write a message			
		Actions /:id
			Get /     //retrieve message with id
			Put /     //update message with id
			Delete /   //delete message with id	
```
