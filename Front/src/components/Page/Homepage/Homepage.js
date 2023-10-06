import AvantPremière from "./AvantPremière";
import Book from "./Book";
import FAQ from "./FAQ";
import Populaires from "./Populaires"
import Carousel from "./carousel.component"

function Homepage() {
  return (
    <div>
        <Carousel/>
        <Populaires/>
        <AvantPremière/>
        <Book/>
        <FAQ/>
    </div>
                /* <details>
                <summary>test ?</summary>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit hic cumque repudiandae corporis fugit illum delectus temporibus. Omnis ab quas, pariatur suscipit soluta ad ipsa cum accusamus perferendis dicta voluptatum.</p>
            </details> */
  )
}

export default Homepage