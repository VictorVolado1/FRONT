import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export const SearchBar = ({ onSearch, onAdd, onChange }) => {
  const handleSearch = () => {
    onSearch();
  };

  const handleAdd = () => {
    onAdd();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex align-items-center gap-2">
      <InputText
        placeholder="Buscar"
        onKeyDown={handleKeyDown}
        className="flex-1"
      />
      <Button
        icon="pi pi-search"
        severity="secondary"
        aria-label="Buscar"
        onClick={handleSearch}
      />
      <Button
        label="AGREGAR"
        severity="info"
        onClick={handleAdd}
      />
    </div>
  );
};