export interface ErrorSheetType {
  showErrorSheet: boolean;
  errorTitle: string;
  errorText: string;
  hideErrorSheet: () => void;
}