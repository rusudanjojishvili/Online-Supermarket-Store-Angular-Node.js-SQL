create database onlinemarket;

use onlinemarket;

create table users(
fname varchar (255) not null,
lname varchar (255) not null,
email varchar (255) not null,
idnumber int not null,
password varchar (255) not null,
city varchar (255) not null,
street varchar (255) not null,
isAdmin boolean not null default false,
primary key (idnumber)
);


create table categories(
id int auto_increment,
name varchar (255) not null,
primary key(id)
);

create table products(
id int auto_increment,
name varchar (255) not null,
c_id int not null,
price int not null,
img_url text not null,
primary key(id),
foreign key(c_id) references categories(id)
);

create table carts(
id int auto_increment,
user_id int not null,
creation_date datetime default now(),
primary key(id),
foreign key(user_id) references users(idnumber)
);


create table cartDetails(
id int auto_increment,
product_id int not null,
quantity int not null default 0,
cart_id int not null,
addition_date datetime default now(),
primary key(id),
foreign key(product_id) references products(id),
foreign key(cart_id) references carts(id)
);

create table orders(
id int auto_increment,
user_id int not null,
cart_id int not null,
total_price int not null,
delivery_city varchar (255) not null,
delivery_street varchar (255) not null,
order_date datetime default now(),
delivery_date date,
credit_card varchar(255) not null,
primary key(id),
foreign key(user_id) references users(idnumber),
foreign key(cart_id) references carts(id)
);


UPDATE `onlinemarket`.`users` SET `isAdmin` = '1' WHERE (`idnumber` = '111111111');


insert into categories
(name)
values("Milk & Eggs"),
("Vegetables & Fruits"),
("Meat & Fish"),
("Wine & Drinks"),
("Chocolate & Sweets"),
("Bakery & Pastry");

insert into products (name,c_id,price,img_url)
values("Pasteurized Milk 3%",1,5.94,"milk.png"),
("Shoko Yotveta",1,11.90,"shoko.png"),
("Package of Actimel Strawberry Yogurt",1,20.90,"aktimel.png"),
("Danone Mixed Berry Dairy Drink",1,5.00,"danone.png"),
("Yoplait Coconut Diet",1,5.00,"yoplait.png"),
("Iced Coffee 1.2% strong",1,7.90,"coffee.png"),
("Iced Coffee 1.6% Refined",1,7.90,"coffref.png"),
("Camembert Cheese",1,27.90,"camembert.png"),
("Quark Creamy Soft Cheese 5%",1,14.25,"tnuva.png"),
("Hard Cheese Emek Sliced 15%",1,15.80,"cheese.png"),
("Gilboa Cheese 22%",1,23.90,"Gilboa.png"),
("Eggs M Omega 3",1,12.9,"eggsomega.png"),
("Eggs L Omega 3",1,19.9,"eggslomega.png"),
("Orange",2,4.90,"orange.png"),
("Avocado",2,14.90,"avocado.png"),
("Apple Starking Delicious",2,9.90,"applestar.png"),
("Kiwi",2,16.90,"kiwi.png"),
("Ananas",2,24.90,"ananas.png"),
("Pear",2,14.90,"pear.png"),
("Packed White Potatoes",2,4.90,"potatoes.png"), 
("Cherry Tomato Whitney",2,9.90,"whitney.png"), 
("Cucumber",2,6.90,"cucumber.png"), 
("Dry Onions",2,4.90,"onions.png"), 
("Ded Bell Pepper",2,8.90,"pepper.png"), 
("Eggplant",2,6.90,"eggplant.png"), 
("Cohlrabi",2,6.90,"cohlrabi.png"), 
("Brocoli",2,12.90,"broccoli.png"), 
("Fresh packed Chicken Thighs",3,27.90,"chicken.png"), 
("Fresh packed Chicken chins",3,32.90,"chin.png"), 
("Fresh ground beef meat",3,49.90,"meat.png"), 
("Fresh Antricot",3,119.90,"antricot.png"), 
("Fresh Salmon Fillet",3,89.90,"fillet.png"),
("Petit castel 750ml",4,119.90,"castel.png"), 
("Ritter Sport Cocoa Wafer",5,9.90,"ritter.png"),
("Kinder Chocolate Fingers",5,7.50,"kinder.png"),
("Rye bread",6,9.90,"rye bread.png"),
("Bugget bread",6,4.50,"bugget.png"),
("Donuts",6,5.00,"donuts.png"),
("Rogalah",6,2.00,"rogalah.png"),
("Cinnamon cake",6,24.90,"cinnamon.png"),
("Fitness Corn flakes",5,19.90,"fitness.png"),
("Oreo cookies",5,8.9,"oreo.png"),
("Milka chocolate",5,6.9,"milka.png"),
("Martini Bitter",4,99.90,"martini.png")

