const bcryptjs = require('bcryptjs');
const db = require('../database/models');
const Author = require('../database/models/Author');

const mainController = {
  home: (req, res) => {
    db.Book.findAll({
      include: [{ association: 'authors' }]
    })
      .then((books) => {
        res.render('home', { books });
      })
      .catch((error) => console.log(error));
  },
  bookDetail: (req, res) => {
    // Implement look for details in the database
    
 db.Book
    .findByPk(req.params.id)
    .then(book => {
       res.render("bookDetail", {book:book});
    })
    .catch(err => {
       res.send(err)
    })

    
  },
  bookSearch: (req, res) => {
    res.render('search', { books: [] });
  },
  bookSearchResult: (req, res) => {
    // Implement search by title
    let title = req.body.title;
    
    //console.log(condition);
    db.Book.findAll({
      include: [{ association: 'authors' }],
   
       where: {title:title}})
      
      .then(books => {
          if (books.length > 0) {
        
          res.render('bookDetail', {books})    
          }
          else {
            res.render('search', { books: [] }) 
          }
        })
    //res.render('search');
  },
    
      deleteBook: (req, res) => {
        // Implement delete book
        let pId = req.params.id;
       
        db.Booksauthors
        .destroy({where: {BookId: pId  }, force: true}) 
        .then(() => {
          db.Book.destroy({ where: { id: pId } })
      })
        .then(()=>{
            return res.redirect('/')})
        .catch(error => res.send(error)) 
        
      },


  authors: (req, res) => {
    db.Author.findAll()
      .then((authors) => {
        res.render('authors', { authors });
      })
      .catch((error) => console.log(error));
  },
  authorBooks: (req, res) => {
    // Implement books by author
    
    let ide=req.params.id
    var condition = ide ? {  [db.Sequelize.Op.like]: `%${ide}%`  } : null;
    db.Author.findAll({
      include: [{ association: 'books' }],

      where: {id:condition}
    })
      .then((authors) => {
        console.log(JSON.stringify(authors, null, 2));

        res.render('authorBooks', { authors });
      })
      .catch((error) => console.log(error));
  
  },



  register: (req, res) => {
    res.render('register');
  },
  processRegister: (req, res) => {
    db.User.create({
      Name: req.body.name,
      Email: req.body.email,
      Country: req.body.country,
      Pass: bcryptjs.hashSync(req.body.password, 10),
      CategoryId: req.body.category
    })
      .then(() => {
        res.redirect('/');
      })
      .catch((error) => console.log(error));
  },
  login: (req, res) => {
    // Implement login process
    res.render('login');
  },
  processLogin: (req, res) => {
    // Implement login process
    res.render('home')
  },
  edit: (req, res) => {
    // Implement edit book
     db.Book.findByPk(req.params.id)
      .then(function(book){
        res.render('editBook', {book:book})
      })
    

  },
  processEdit: (req, res) => {
    // Implement edit book
   db.Book.update({
    title: req.body.title,
    cover: req.body.cover,
    descripcion:  req.body.descripcion,
  },
  {
    where: {
      id: req.params.id
    }
  })  
  res.redirect('/books/detail/'+req.params.id)  
},

}


module.exports = mainController;
