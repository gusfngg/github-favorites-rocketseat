import { GithubUser } from './githubUser.js'

/* classe que vai conter a lógica dos dados
como os dados serão estruturados */
class Favorites {
   constructor(root) {
      this.root = document.querySelector(root)
      this.load()
   }

   load() {
      this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
   }

   save() {
      localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
   }

   async add(username) {
      try {
         const userExists = this.entries.find(entry => entry.login === username)

         if(userExists) {
            throw new Error('Usuario já cadastrado!')
         }

         const user = await GithubUser.search(username)
         
         if(user.login === undefined) {
            throw new Error('Usuário não econtrado!')
         }
         
         this.entries = [user, ...this.entries]
         this.uptade()
         this.save()
         
         } catch (error) {
            alert(error.message)
         }
   }

   delete(user) {
      const filterendEntries = this.entries.filter (entry => entry.login !== user.login)

      this.entries = filterendEntries
      this.uptade()
      this.save()
   }

   
}



/* classe que vai a visualização e eventos do HTML */
export class FavoritesViews extends Favorites {
   // nesse momento o root é #app, que foi passado no main.js
   constructor(root) { 
      super(root)  // o #app foi passado para o super, ele puxa o consctructor da class Favorites 

      this.tbody = this.root.querySelector('table tbody')

      this.uptade()
      this.onadd()
   }

   onadd() {
      const addButton = this.root.querySelector('.search button')
      addButton.onclick = () => {
          const { value } = this.root.querySelector('.search input')

          this.add(value)
      }
  }

   uptade() {
      this.removeAllTr()
      
      this.entries.forEach((user) => {
         const row = this.createRow()
         
         row.querySelector('.user img').src = `https://github.com/${user.login}.png`
         row.querySelector('.user a').href = `https://github.com/${user.login}`
         row.querySelector('.user img').alt = `Imagem de ${user.name}`
         row.querySelector('.user p').textContent = user.name
         row.querySelector('.user span').textContent = user.login
         row.querySelector('.repositories').textContent = user.public_repos
         row.querySelector('.followers').textContent = user.followers

         row.querySelector('.remove').onclick = () => {
            const isOk = confirm('Tem certeza que deseja deletar esse usuário?')

            if(isOk) {
               this.delete(user)
            }
         }
         this.tbody.append(row)
      })
   }

   createRow() {
      const tr = document.createElement('tr')

      tr.innerHTML = `
      <td class="user">
         <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
         <a href="https://github.com/maykbrito" target="_blank">
           <p>Mayk Brito</p>
           <span>maykbrito</span>
         </a>
       </td>
       <td class="repositories">
         76
       </td>
       <td class="followers">
         9589
       </td>
       <td>
         <button class="remove">&times;</button>
       </td>
      `
      
      return tr
}


   removeAllTr() {
      this.tbody.querySelectorAll('tr').forEach((tr) => {
         tr.remove()
      }) 
   }

}