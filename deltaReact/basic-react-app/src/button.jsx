function handleClick(event) {
  console.log("Hello");
  console.log(event);
}

function handleMouseOver() {
  console.log("Bye!");
}

function handleDblClick(){
    console.log("you double clicked");
}

export default function Button() {
  return (
    <div>
      <button onClick={handleClick}>Click Me!</button>
      <p onMouseOver={handleMouseOver}>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta rem
        minima necessitatibus tenetur earum, pariatur culpa aspernatur provident
        eius dolorum quod libero doloremque nam magnam ipsam quaerat perferendis
        amet, accusantium esse laudantium. Eligendi officiis illo nam, veniam
        consectetur aspernatur ratione?
      </p>
      <button onDoubleClick={handleDblClick}>Double click me!</button>
    </div>
  );
}
