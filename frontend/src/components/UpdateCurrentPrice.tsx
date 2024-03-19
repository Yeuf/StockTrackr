import axios from "axios";
import Button from "./Button";

function UpdateCurrentPrice() {
  const handleButtonClick = () => {
    axios
      .post("http://127.0.0.1:8000/api/portfolio/update_current_prices/")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error:", error.response.data);
      });
  };

  return (
    <Button
      onClick={handleButtonClick}
      color="blue"
      className="px-3 py-1 ml-4 mr-2 mb-2"
    >
      Update Prices
    </Button>
  );
}

export default UpdateCurrentPrice;
