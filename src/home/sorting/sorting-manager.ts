import { fetchAndDisplayPreviews } from "../fetch-github/fetch-and-display-previews";
import { Sorting } from "./generate-sorting-buttons";

export class SortingManager {
  private _lastChecked: HTMLInputElement | null = null;
  private _toolBarFilters: HTMLElement;
  private _filterTextBox: HTMLInputElement;
  private _sortingButtons: HTMLElement;

  constructor(filtersId: string, sortingOptions: readonly string[]) {
    const filters = document.getElementById(filtersId);
    if (!filters) throw new Error(`${filtersId} not found`);
    this._toolBarFilters = filters;
    this._filterTextBox = this._generateFilterTextBox();
    this._sortingButtons = this._generateSortingButtons(sortingOptions);
  }

  public render() {
    this._toolBarFilters.appendChild(this._sortingButtons);
    this._toolBarFilters.appendChild(this._filterTextBox);
  }

  private _generateFilterTextBox() {
    const textBox = document.createElement("input");
    textBox.type = "text";
    textBox.id = "filter";
    textBox.placeholder = "Text Filter";
    return textBox;
  }

  private _generateSortingButtons(sortingOptions: readonly string[]) {
    const buttons = document.createElement("div");
    buttons.className = "labels";

    sortingOptions.forEach((option) => {
      const input = this._createRadioButton(option);
      const label = this._createLabel(option);

      buttons.appendChild(input);
      buttons.appendChild(label);

      input.addEventListener("click", () => this._handleSortingClick(input, option));
    });

    return buttons;
    // this._filters.appendChild(labels);
  }

  private _createRadioButton(option: string): HTMLInputElement {
    const input = document.createElement("input");
    input.type = "radio";
    input.value = option;
    input.id = option;
    input.name = "sort";
    return input;
  }

  private _createLabel(option: string): HTMLLabelElement {
    const label = document.createElement("label");
    label.htmlFor = option;
    label.textContent = option.charAt(0).toUpperCase() + option.slice(1);
    return label;
  }

  private _handleSortingClick(input: HTMLInputElement, option: string) {
    const ordering = input === this._lastChecked ? "reverse" : "normal";
    input.checked = input !== this._lastChecked;
    input.setAttribute("data-ordering", ordering);
    this._lastChecked = input.checked ? input : null;
    this._filterTextBox.value = "";
    input.parentElement?.childNodes.forEach((node) => {
      if (node instanceof HTMLInputElement) {
        node.setAttribute("data-ordering", "");
      }
    });

    input.setAttribute("data-ordering", ordering);
    fetchAndDisplayPreviews(option as Sorting, { ordering }).catch((error) => console.error(error));
  }
}
