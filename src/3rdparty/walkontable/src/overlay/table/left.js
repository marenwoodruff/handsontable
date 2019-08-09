import OverlayTable from './_base';

class LeftOverlayTable extends OverlayTable {
  getRenderedColumnsCount() {
    const totalColumns = this.wot.getSetting('totalColumns');
    return Math.min(this.wot.getSetting('fixedColumnsLeft'), totalColumns);
  }
}

export default LeftOverlayTable;