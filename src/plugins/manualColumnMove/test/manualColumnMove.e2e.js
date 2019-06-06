describe('manualColumnMove', () => {
  const id = 'testContainer';

  beforeEach(function() {
    this.$container = $(`<div id="${id}"></div>`).appendTo('body');
  });

  afterEach(function() {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  describe('init', () => {
    it('should change column order at init', () => {
      handsontable({
        data: Handsontable.helper.createSpreadsheetData(3, 10),
        manualColumnMove: [1, 2, 0]
      });

      expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('B1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('C1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('A1');
    });
  });

  describe('updateSettings', () => {
    it('should be enabled after specifying it in updateSettings config', () => {
      handsontable({
        data: Handsontable.helper.createSpreadsheetData(3, 10),
        colHeaders: true
      });

      updateSettings({
        manualColumnMove: true
      });

      spec().$container.find('tbody tr:eq(0) th:eq(0)').simulate('mousedown');
      spec().$container.find('tbody tr:eq(0) th:eq(0)').simulate('mouseup');

      expect(spec().$container.hasClass('after-selection--rows')).toBeGreaterThan(0);
    });

    it('should change the default column order with updateSettings', () => {
      handsontable({
        data: Handsontable.helper.createSpreadsheetData(3, 10),
        manualColumnMove: true
      });

      expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('A1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('B1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('C1');

      updateSettings({
        manualColumnMove: [2, 1, 0]
      });

      expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('C1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('B1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('A1');
    });

    it('should change column order with updateSettings', () => {
      handsontable({
        data: Handsontable.helper.createSpreadsheetData(3, 10),
        manualColumnMove: [1, 2, 0]
      });

      expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('B1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('C1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('A1');

      updateSettings({
        manualColumnMove: [2, 1, 0]
      });

      expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('C1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('B1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('A1');
    });

    it('should reset column order with updateSettings when `undefined` is passed', () => {
      handsontable({
        data: Handsontable.helper.createSpreadsheetData(3, 10),
        manualColumnMove: [1, 2, 0]
      });

      expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('B1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('C1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('A1');

      updateSettings({
        manualColumnMove: void 0
      });

      expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('A1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('B1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('C1');
    });

    it('should not change column order with updateSettings when `true` is passed', () => {
      handsontable({
        data: Handsontable.helper.createSpreadsheetData(3, 10),
        manualColumnMove: [1, 2, 0]
      });

      expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('B1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('C1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('A1');

      updateSettings({
        manualColumnMove: true
      });

      expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('B1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('C1');
      expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('A1');
    });
  });

  describe('moving', () => {
    it('should keep cell meta created using cells function', () => {
      const hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(3, 10),
        colHeaders: true,
        manualColumnMove: true,
        cells(row, col) {
          if (row === 1 && col === 0) {
            this.readOnly = true;
          }
        }
      });

      const htCore = getHtCore();

      expect(htCore.find('tbody tr:eq(0) td:eq(1)')[0].className.indexOf('htDimmed')).toBeGreaterThan(-1);

      hot.getPlugin('manualColumnMove').moveColumn(1, 3);
      hot.render();

      expect(htCore.find('tbody tr:eq(0) td:eq(3)')[0].className.indexOf('htDimmed')).toBeGreaterThan(-1);
    });

    it('should keep cell meta created using cell array', () => {
      const hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(3, 10),
        colHeaders: true,
        manualColumnMove: true,
        cell: [
          { row: 1, col: 0, readOnly: true }
        ]
      });

      const htCore = getHtCore();

      expect(htCore.find('tbody tr:eq(0) td:eq(1)')[0].className.indexOf('htDimmed')).toBeGreaterThan(-1);

      hot.getPlugin('manualColumnMove').moveColumn(3, 1);
      hot.render();

      expect(htCore.find('tbody tr:eq(0) td:eq(2)')[0].className.indexOf('htDimmed')).toBeGreaterThan(-1);
    });

    describe('by API', () => {
      describe('the `moveColumn` method', () => {
        it('should move single column from the right to the left', () => {
          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          hot.getPlugin('manualColumnMove').moveColumn(2, 0);
          hot.render();

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('C1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('B1');
        });

        it('should move single column from the left to the right', () => {
          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          hot.getPlugin('manualColumnMove').moveColumn(0, 2);
          hot.render();

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('B1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('C1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('A1');
        });

        it('should revert change by two moves', () => {
          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          hot.getPlugin('manualColumnMove').moveColumn(1, 0);
          hot.render();

          hot.getPlugin('manualColumnMove').moveColumn(1, 0);
          hot.render();

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('B1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('C1');
        });

        it('should not move and not trigger the `afterColumnMove` hook after try of moving column, when `beforeColumnMove` return false', () => {
          const afterMoveColumnCallback = jasmine.createSpy('afterMoveColumnCallback');

          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            colHeaders: true,
            manualColumnMove: true,
            beforeColumnMove() {
              return false;
            },
            afterColumnMove: afterMoveColumnCallback
          });

          hot.getPlugin('manualColumnMove').moveColumn(0, 1);

          expect(afterMoveColumnCallback).not.toHaveBeenCalled();
          expect(hot.getDataAtCol(0)).toEqual(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']);
        });

        it('should not move and trigger the `afterColumnMove` hook with proper arguments after try of moving column to final index, which is too high', () => {
          const afterMoveColumnCallback = jasmine.createSpy('afterMoveColumnCallback');

          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            colHeaders: true,
            manualColumnMove: true,
            afterColumnMove: afterMoveColumnCallback
          });

          hot.getPlugin('manualColumnMove').moveColumn(0, 1000);

          expect(afterMoveColumnCallback).toHaveBeenCalledWith([0], 1000, void 0, false, false, void 0);
          expect(hot.getDataAtCol(0)).toEqual(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']);
        });

        it('should not move and trigger the `afterColumnMove` hook with proper arguments after try of moving column to final index, which is too low', () => {
          const afterMoveColumnCallback = jasmine.createSpy('afterMoveColumnCallback');

          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            colHeaders: true,
            manualColumnMove: true,
            afterColumnMove: afterMoveColumnCallback
          });

          hot.getPlugin('manualColumnMove').moveColumn(0, -1);

          expect(afterMoveColumnCallback).toHaveBeenCalledWith([0], -1, void 0, false, false, void 0);
          expect(hot.getDataAtCol(0)).toEqual(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']);
        });

        it('should not move and trigger the `afterColumnMove` hook with proper arguments after try of moving too high column', () => {
          const afterMoveColumnCallback = jasmine.createSpy('afterMoveColumnCallback');

          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            colHeaders: true,
            manualColumnMove: true,
            afterColumnMove: afterMoveColumnCallback
          });

          hot.getPlugin('manualColumnMove').moveColumn(1000, 1);

          expect(afterMoveColumnCallback).toHaveBeenCalledWith([1000], 1, void 0, false, false, void 0);
          expect(hot.getDataAtCol(0)).toEqual(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']);
        });

        it('should not move and trigger the `afterColumnMove` hook with proper arguments after try of moving too low column', () => {
          const afterMoveColumnCallback = jasmine.createSpy('afterMoveColumnCallback');

          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            colHeaders: true,
            manualColumnMove: true,
            afterColumnMove: afterMoveColumnCallback
          });

          hot.getPlugin('manualColumnMove').moveColumn(-1, 1);

          expect(afterMoveColumnCallback).toHaveBeenCalledWith([-1], 1, void 0, false, false, void 0);
          expect(hot.getDataAtCol(0)).toEqual(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']);
        });
      });

      describe('the `moveColumns` method', () => {
        it('should move multiple columns from the right to the left #1', () => {
          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          hot.getPlugin('manualColumnMove').moveColumns([7, 9, 8], 0);
          hot.render();

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('H1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('J1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('I1');
        });

        it('should move multiple columns from the right to the left #2', () => {
          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          hot.getPlugin('manualColumnMove').moveColumns([9, 7, 8], 0);
          hot.render();

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('J1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('H1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('I1');
        });

        it('should move multiple columns with mixed indexes #1', () => {
          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          hot.getPlugin('manualColumnMove').moveColumns([0, 1, 4], 0);
          hot.render();

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('B1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('E1');
        });

        it('should move multiple columns with mixed indexes #2', () => {
          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          hot.getPlugin('manualColumnMove').moveColumns([1, 4, 0, 5], 3);
          hot.render();

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('C1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('D1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('G1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(3)').text()).toEqual('B1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(4)').text()).toEqual('E1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(5)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(6)').text()).toEqual('F1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(7)').text()).toEqual('H1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(8)').text()).toEqual('I1');
        });
      });

      describe('the `dragColumn` method', () => {
        it('should not change order when dragging single column from the position of first column to the left side of second column', () => {
          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          hot.getPlugin('manualColumnMove').dragColumn(0, 1);
          hot.render();

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('B1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('C1');
        });

        it('should not change order when dragging single column from the position of first column to the left side of first column', () => {
          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          hot.getPlugin('manualColumnMove').dragColumn(0, 0);
          hot.render();

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('B1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('C1');
        });

        it('should change order properly when dragging single column from the position of first column to the left side of fourth column', () => {
          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          hot.getPlugin('manualColumnMove').dragColumn(0, 3);
          hot.render();

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('B1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('C1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(3)').text()).toEqual('D1');
        });

        it('should change order properly when dragging single column from the position of fourth column to the left side of first column', () => {
          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          hot.getPlugin('manualColumnMove').dragColumn(3, 0);
          hot.render();

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('D1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('B1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(3)').text()).toEqual('C1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(4)').text()).toEqual('E1');
        });
      });

      describe('the `dragColumns` method', () => {
        it('should not change order when dragging multiple columns to the specific position', () => {
          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          hot.getPlugin('manualColumnMove').dragColumns([0, 1, 2, 3], 2);
          hot.render();

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('B1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('C1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(3)').text()).toEqual('D1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(4)').text()).toEqual('E1');
        });

        it('should change order properly when dragging multiple columns from the left to the right', () => {
          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          hot.getPlugin('manualColumnMove').dragColumns([0, 1, 2], 4);
          hot.render();

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('D1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('B1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(3)').text()).toEqual('C1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(4)').text()).toEqual('E1');
        });

        it('should change order properly when dragging multiple columns from the right to the left', () => {
          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          hot.getPlugin('manualColumnMove').dragColumns([4, 3, 2], 0);
          hot.render();

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('E1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('D1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('C1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(3)').text()).toEqual('A1');
        });

        it('should not move and trigger the `afterColumnMove` hook with proper arguments after try of dragging columns to index, which is too high', () => {
          let movePossible;
          let orderChanged;

          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            colHeaders: true,
            manualColumnMove: true,
            afterColumnMove(...args) {
              [, , , movePossible, orderChanged] = args;
            }
          });

          hot.getPlugin('manualColumnMove').dragColumns([1, 2, 3], 15);

          expect(movePossible).toBeFalsy();
          expect(orderChanged).toBeFalsy();
          expect(hot.getDataAtCol(0)).toEqual(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']);
        });

        it('should not move and trigger the `afterColumnMove` hook with proper arguments after try of dragging columns to index, which is too low', () => {
          let movePossible;
          let orderChanged;

          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            colHeaders: true,
            manualColumnMove: true,
            afterColumnMove(...args) {
              [, , , movePossible, orderChanged] = args;
            }
          });

          hot.getPlugin('manualColumnMove').dragColumns([1, 2, 3], -1);

          expect(movePossible).toBeFalsy();
          expect(orderChanged).toBeFalsy();
          expect(hot.getDataAtCol(0)).toEqual(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']);
        });

        it('should not move and trigger the `afterColumnMove` hook with proper arguments after try of dragging too low columns to index, which is too high', () => {
          let movePossible;
          let orderChanged;

          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            colHeaders: true,
            manualColumnMove: true,
            afterColumnMove(...args) {
              [, , , movePossible, orderChanged] = args;
            }
          });

          hot.getPlugin('manualColumnMove').dragColumns([-1, -2, -3, -4], 15);

          expect(movePossible).toBeFalsy();
          expect(orderChanged).toBeFalsy();
          expect(hot.getDataAtCol(0)).toEqual(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']);
        });

        it('should not move and trigger the `afterColumnMove` hook with proper arguments after try of dragging too low columns to index, which is too low', () => {
          let movePossible;
          let orderChanged;

          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            colHeaders: true,
            manualColumnMove: true,
            afterColumnMove(...args) {
              [, , , movePossible, orderChanged] = args;
            }
          });

          hot.getPlugin('manualColumnMove').dragColumns([-2, -3, -4, -5], -1);

          expect(movePossible).toBeFalsy();
          expect(orderChanged).toBeFalsy();
          expect(hot.getDataAtCol(0)).toEqual(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10']);
        });
      });
    });

    describe('by drag', () => {
      describe('should trigger the `beforeColumnMove` and `afterColumnMove` hooks with proper parameters (moving single column)', () => {
        it('visual indexes as parameters', () => {
          const beforeColumnMoveCallback = jasmine.createSpy('beforeColumnMoveCallback');
          const afterMoveColumnCallback = jasmine.createSpy('afterMoveColumnCallback');

          const hot = handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true,
            beforeColumnMove: beforeColumnMoveCallback,
            afterColumnMove: afterMoveColumnCallback,
            modifyCol(column) {
              return column + 10;
            }
          });

          hot.getPlugin('manualColumnMove').moveColumns([8, 9, 7], 0);
          hot.render();

          expect(beforeColumnMoveCallback).toHaveBeenCalledWith([8, 9, 7], 0, void 0, true, void 0, void 0);
          expect(afterMoveColumnCallback).toHaveBeenCalledWith([8, 9, 7], 0, void 0, true, true, void 0);
        });

        describe('moving single column from the right to the left', () => {
          it('drag first column before the left side of the first header', () => {
            let finalIndex1;
            let dropIndex1;
            let movePossible1;
            let finalIndex2;
            let dropIndex2;
            let movePossible2;
            let orderChanged;

            handsontable({
              data: Handsontable.helper.createSpreadsheetData(10, 10),
              rowHeaders: true,
              colHeaders: true,
              manualColumnMove: true,
              beforeColumnMove(...args) {
                [, finalIndex1, dropIndex1, movePossible1] = args;
              },
              afterColumnMove(...args) {
                [, finalIndex2, dropIndex2, movePossible2, orderChanged] = args;
              }
            });

            const $fistHeader = spec().$container.find('thead tr:eq(0) th:eq(1)');

            $fistHeader.simulate('mousedown');
            $fistHeader.simulate('mouseup');
            $fistHeader.simulate('mousedown');

            $fistHeader.simulate('mouseover');
            $fistHeader.simulate('mousemove', {
              clientX: $fistHeader.offset().left - $fistHeader.width() - 200
            });

            $fistHeader.simulate('mouseup');

            expect(finalIndex1).toEqual(0);
            expect(dropIndex1).toEqual(0);
            expect(movePossible1).toBeTruthy();

            expect(finalIndex2).toEqual(0);
            expect(dropIndex2).toEqual(0);
            expect(movePossible2).toBeTruthy();
            expect(orderChanged).toBeFalsy();
          });

          it('drag first column to the left side of the first header', () => {
            let finalIndex1;
            let dropIndex1;
            let movePossible1;
            let finalIndex2;
            let dropIndex2;
            let movePossible2;
            let orderChanged;

            handsontable({
              data: Handsontable.helper.createSpreadsheetData(10, 10),
              rowHeaders: true,
              colHeaders: true,
              manualColumnMove: true,
              beforeColumnMove(...args) {
                [, finalIndex1, dropIndex1, movePossible1] = args;
              },
              afterColumnMove(...args) {
                [, finalIndex2, dropIndex2, movePossible2, orderChanged] = args;
              }
            });

            const $fistHeader = spec().$container.find('thead tr:eq(0) th:eq(1)');

            $fistHeader.simulate('mousedown');
            $fistHeader.simulate('mouseup');
            $fistHeader.simulate('mousedown');

            $fistHeader.simulate('mouseover');
            $fistHeader.simulate('mousemove');
            $fistHeader.simulate('mouseup');

            expect(finalIndex1).toEqual(0);
            expect(dropIndex1).toEqual(0);
            expect(movePossible1).toBeTruthy();

            expect(finalIndex2).toEqual(0);
            expect(dropIndex2).toEqual(0);
            expect(movePossible2).toBeTruthy();
            expect(orderChanged).toBeFalsy();
          });

          it('drag second column before the left side of the first header', () => {
            let finalIndex1;
            let dropIndex1;
            let movePossible1;
            let finalIndex2;
            let dropIndex2;
            let movePossible2;
            let orderChanged;

            handsontable({
              data: Handsontable.helper.createSpreadsheetData(10, 10),
              rowHeaders: true,
              colHeaders: true,
              manualColumnMove: true,
              beforeColumnMove(...args) {
                [, finalIndex1, dropIndex1, movePossible1] = args;
              },
              afterColumnMove(...args) {
                [, finalIndex2, dropIndex2, movePossible2, orderChanged] = args;
              }
            });

            const $fistHeader = spec().$container.find('thead tr:eq(0) th:eq(1)');
            const $secondHeader = spec().$container.find('thead tr:eq(0) th:eq(2)');

            $secondHeader.simulate('mousedown');
            $secondHeader.simulate('mouseup');
            $secondHeader.simulate('mousedown');

            $fistHeader.simulate('mouseover');

            $fistHeader.simulate('mousemove', {
              clientX: $fistHeader.offset().left - $fistHeader.width() - 50
            });
            $fistHeader.simulate('mouseup');

            expect(finalIndex1).toEqual(0);
            expect(dropIndex1).toEqual(0);
            expect(movePossible1).toBeTruthy();

            expect(finalIndex2).toEqual(0);
            expect(dropIndex2).toEqual(0);
            expect(movePossible2).toBeTruthy();
            expect(orderChanged).toBeTruthy();
          });

          it('drag second column to the left side of the first header', () => {
            let finalIndex1;
            let dropIndex1;
            let movePossible1;
            let finalIndex2;
            let dropIndex2;
            let movePossible2;
            let orderChanged;

            handsontable({
              data: Handsontable.helper.createSpreadsheetData(10, 10),
              rowHeaders: true,
              colHeaders: true,
              manualColumnMove: true,
              beforeColumnMove(...args) {
                [, finalIndex1, dropIndex1, movePossible1] = args;
              },
              afterColumnMove(...args) {
                [, finalIndex2, dropIndex2, movePossible2, orderChanged] = args;
              }
            });
            const $fistHeader = spec().$container.find('thead tr:eq(0) th:eq(1)');
            const $secondHeader = spec().$container.find('thead tr:eq(0) th:eq(2)');

            $secondHeader.simulate('mousedown');
            $secondHeader.simulate('mouseup');
            $secondHeader.simulate('mousedown');

            $fistHeader.simulate('mouseover');
            $fistHeader.simulate('mousemove', {
              clientX: $fistHeader.offset().left - $fistHeader.width()
            });
            $fistHeader.simulate('mouseup');

            expect(finalIndex1).toEqual(0);
            expect(dropIndex1).toEqual(0);
            expect(movePossible1).toBeTruthy();

            expect(finalIndex2).toEqual(0);
            expect(dropIndex2).toEqual(0);
            expect(movePossible2).toBeTruthy();
            expect(orderChanged).toBeTruthy();
          });

          it('drag second column to the right side of first header (left side of second column)', () => {
            let finalIndex1;
            let dropIndex1;
            let movePossible1;
            let finalIndex2;
            let dropIndex2;
            let movePossible2;
            let orderChanged;

            handsontable({
              data: Handsontable.helper.createSpreadsheetData(10, 10),
              rowHeaders: true,
              colHeaders: true,
              manualColumnMove: true,
              beforeColumnMove(...args) {
                [, finalIndex1, dropIndex1, movePossible1] = args;
              },
              afterColumnMove(...args) {
                [, finalIndex2, dropIndex2, movePossible2, orderChanged] = args;
              }
            });

            const $secondHeader = spec().$container.find('thead tr:eq(0) th:eq(2)');

            $secondHeader.simulate('mousedown');
            $secondHeader.simulate('mouseup');
            $secondHeader.simulate('mousedown');

            $secondHeader.simulate('mouseover');
            $secondHeader.simulate('mousemove');
            $secondHeader.simulate('mouseup');

            expect(finalIndex1).toEqual(1);
            expect(dropIndex1).toEqual(1);
            expect(movePossible1).toBeTruthy();

            expect(finalIndex2).toEqual(1);
            expect(dropIndex2).toEqual(1);
            expect(movePossible2).toBeTruthy();
            expect(orderChanged).toBeFalsy();
          });
        });

        describe('moving single column from the left to the right', () => {
          it('drag first column to the middle of the table', () => {
            let finalIndex1;
            let dropIndex1;
            let movePossible1;
            let finalIndex2;
            let dropIndex2;
            let movePossible2;
            let orderChanged;

            handsontable({
              data: Handsontable.helper.createSpreadsheetData(10, 10),
              rowHeaders: true,
              colHeaders: true,
              manualColumnMove: true,
              beforeColumnMove(...args) {
                [, finalIndex1, dropIndex1, movePossible1] = args;
              },
              afterColumnMove(...args) {
                [, finalIndex2, dropIndex2, movePossible2, orderChanged] = args;
              }
            });

            const $fistHeader = spec().$container.find('thead tr:eq(0) th:eq(1)');
            const $middleHeader = spec().$container.find('thead tr:eq(0) th:eq(3)');

            $fistHeader.simulate('mousedown');
            $fistHeader.simulate('mouseup');
            $fistHeader.simulate('mousedown');

            $middleHeader.simulate('mouseover');
            $middleHeader.simulate('mousemove');
            $middleHeader.simulate('mouseup');

            expect(finalIndex1).toEqual(1);
            expect(dropIndex1).toEqual(2);
            expect(movePossible1).toBeTruthy();

            expect(finalIndex2).toEqual(1);
            expect(dropIndex2).toEqual(2);
            expect(movePossible2).toBeTruthy();
            expect(orderChanged).toBeTruthy();
          });

          it('drag first column to the left side of last header', () => {
            let finalIndex1;
            let dropIndex1;
            let movePossible1;
            let finalIndex2;
            let dropIndex2;
            let movePossible2;
            let orderChanged;

            handsontable({
              data: Handsontable.helper.createSpreadsheetData(10, 10),
              rowHeaders: true,
              colHeaders: true,
              manualColumnMove: true,
              beforeColumnMove(...args) {
                [, finalIndex1, dropIndex1, movePossible1] = args;
              },
              afterColumnMove(...args) {
                [, finalIndex2, dropIndex2, movePossible2, orderChanged] = args;
              }
            });

            const $fistHeader = spec().$container.find('thead tr:eq(0) th:eq(1)');
            const $lastHeader = spec().$container.find('thead tr:eq(0) th:eq(10)');

            $fistHeader.simulate('mousedown');
            $fistHeader.simulate('mouseup');
            $fistHeader.simulate('mousedown');

            $lastHeader.simulate('mouseover');
            $lastHeader.simulate('mousemove');
            $lastHeader.simulate('mouseup');

            expect(finalIndex1).toEqual(8);
            expect(dropIndex1).toEqual(9);
            expect(movePossible1).toBeTruthy();

            expect(finalIndex2).toEqual(8);
            expect(dropIndex2).toEqual(9);
            expect(movePossible2).toBeTruthy();
            expect(orderChanged).toBeTruthy();
          });

          it('drag first column to the right side of last header', () => {
            let finalIndex1;
            let dropIndex1;
            let movePossible1;
            let finalIndex2;
            let dropIndex2;
            let movePossible2;
            let orderChanged;

            handsontable({
              data: Handsontable.helper.createSpreadsheetData(10, 10),
              rowHeaders: true,
              colHeaders: true,
              manualColumnMove: true,
              beforeColumnMove(...args) {
                [, finalIndex1, dropIndex1, movePossible1] = args;
              },
              afterColumnMove(...args) {
                [, finalIndex2, dropIndex2, movePossible2, orderChanged] = args;
              }
            });

            const $fistHeader = spec().$container.find('thead tr:eq(0) th:eq(1)');
            const $lastHeader = spec().$container.find('thead tr:eq(0) th:eq(10)');

            $fistHeader.simulate('mousedown');
            $fistHeader.simulate('mouseup');
            $fistHeader.simulate('mousedown');

            $lastHeader.simulate('mouseover');
            $lastHeader.simulate('mousemove', {
              clientX: $lastHeader.offset().left + $lastHeader.width()
            });
            $lastHeader.simulate('mouseup');

            expect(finalIndex1).toEqual(9);
            expect(dropIndex1).toEqual(10);
            expect(movePossible1).toBeTruthy();

            expect(finalIndex2).toEqual(9);
            expect(dropIndex2).toEqual(10);
            expect(movePossible2).toBeTruthy();
            expect(orderChanged).toBeTruthy();
          });

          it('drag first column behind the right side of last header', () => {
            let finalIndex1;
            let dropIndex1;
            let movePossible1;
            let finalIndex2;
            let dropIndex2;
            let movePossible2;
            let orderChanged;

            handsontable({
              data: Handsontable.helper.createSpreadsheetData(10, 10),
              rowHeaders: true,
              colHeaders: true,
              manualColumnMove: true,
              beforeColumnMove(...args) {
                [, finalIndex1, dropIndex1, movePossible1] = args;
              },
              afterColumnMove(...args) {
                [, finalIndex2, dropIndex2, movePossible2, orderChanged] = args;
              }
            });

            const $fistHeader = spec().$container.find('thead tr:eq(0) th:eq(1)');
            const $lastHeader = spec().$container.find('thead tr:eq(0) th:eq(10)');

            $fistHeader.simulate('mousedown');
            $fistHeader.simulate('mouseup');
            $fistHeader.simulate('mousedown');

            $lastHeader.simulate('mouseover');
            $lastHeader.simulate('mousemove', {
              clientX: $lastHeader.offset().left + $lastHeader.width() + 200
            });
            $lastHeader.simulate('mouseup');

            expect(finalIndex1).toEqual(9);
            expect(dropIndex1).toEqual(10);
            expect(movePossible1).toBeTruthy();

            expect(finalIndex2).toEqual(9);
            expect(dropIndex2).toEqual(10);
            expect(movePossible2).toBeTruthy();
            expect(orderChanged).toBeTruthy();
          });
        });

        it('moving multiple columns from the left to the right', () => {
          let finalIndex1;
          let dropIndex1;
          let movePossible1;
          let finalIndex2;
          let dropIndex2;
          let movePossible2;
          let orderChanged;

          handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            colHeaders: true,
            manualColumnMove: true,
            beforeColumnMove(...args) {
              [, finalIndex1, dropIndex1, movePossible1] = args;
            },
            afterColumnMove(...args) {
              [, finalIndex2, dropIndex2, movePossible2, orderChanged] = args;
            }
          });

          selectColumns(0, 2);

          const $fistHeader = spec().$container.find('thead tr:eq(0) th:eq(1)');
          const $middleHeader = spec().$container.find('thead tr:eq(0) th:eq(6)');

          $fistHeader.simulate('mousedown');
          $fistHeader.simulate('mouseup');
          $fistHeader.simulate('mousedown');

          $middleHeader.simulate('mouseover');
          $middleHeader.simulate('mousemove');
          $middleHeader.simulate('mouseup');

          expect(finalIndex1).toEqual(2);
          expect(dropIndex1).toEqual(5);
          expect(movePossible1).toBeTruthy();

          expect(finalIndex2).toEqual(2);
          expect(dropIndex2).toEqual(5);
          expect(movePossible2).toBeTruthy();
          expect(orderChanged).toBeTruthy();
        });

        it('moving multiple columns from the right to the left', () => {
          let finalIndex1;
          let dropIndex1;
          let movePossible1;
          let finalIndex2;
          let dropIndex2;
          let movePossible2;
          let orderChanged;

          handsontable({
            data: Handsontable.helper.createSpreadsheetData(10, 10),
            rowHeaders: true,
            colHeaders: true,
            manualColumnMove: true,
            beforeColumnMove(...args) {
              [, finalIndex1, dropIndex1, movePossible1] = args;
            },
            afterColumnMove(...args) {
              [, finalIndex2, dropIndex2, movePossible2, orderChanged] = args;
            }
          });

          selectColumns(0, 2);

          const $secondHeader = spec().$container.find('thead tr:eq(0) th:eq(2)');
          const $middleHeader = spec().$container.find('thead tr:eq(0) th:eq(6)');

          $middleHeader.simulate('mousedown');
          $middleHeader.simulate('mouseup');
          $middleHeader.simulate('mousedown');

          $secondHeader.simulate('mouseover');
          $secondHeader.simulate('mousemove');
          $secondHeader.simulate('mouseup');

          expect(finalIndex1).toEqual(1);
          expect(dropIndex1).toEqual(1);
          expect(movePossible1).toBeTruthy();

          expect(finalIndex2).toEqual(1);
          expect(dropIndex2).toEqual(1);
          expect(movePossible2).toBeTruthy();
          expect(orderChanged).toBeTruthy();
        });
      });

      describe('should position the cells properly', () => {
        it('drag the second column before the left side of first header', () => {
          handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          const $columnHeaders = spec().$container.find('thead tr th');

          $columnHeaders.eq(1).simulate('mousedown');
          $columnHeaders.eq(1).simulate('mouseup');
          $columnHeaders.eq(1).simulate('mousedown');
          $columnHeaders.eq(0).simulate('mouseover');
          $columnHeaders.eq(0).simulate('mousemove');
          $columnHeaders.eq(0).simulate('mouseup');

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('B1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('C1');
        });

        it('drag the second column before the fourth column', () => {
          handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          const $columnHeaders = spec().$container.find('thead tr th');

          $columnHeaders.eq(1).simulate('mousedown');
          $columnHeaders.eq(1).simulate('mouseup');
          $columnHeaders.eq(1).simulate('mousedown');
          $columnHeaders.eq(3).simulate('mouseover');
          $columnHeaders.eq(3).simulate('mousemove');
          $columnHeaders.eq(3).simulate('mouseup');

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('C1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('B1');
        });

        it('drag the fist column below the last column', () => {
          handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          const $fistHeader = spec().$container.find('thead tr:eq(0) th:eq(0)');
          const $lastHeader = spec().$container.find('thead tr:eq(0) th:eq(9)');

          $fistHeader.simulate('mousedown');
          $fistHeader.simulate('mouseup');
          $fistHeader.simulate('mousedown');

          $lastHeader.simulate('mouseover');
          $lastHeader.simulate('mousemove', {
            clientX: $lastHeader.offset().left + $lastHeader.width()
          });
          $lastHeader.simulate('mouseup');

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('B1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(9)').text()).toEqual('A1');
        });

        it('drag the last column before the first column', () => {
          handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          const $fistHeader = spec().$container.find('thead tr:eq(0) th:eq(0)');
          const $lastHeader = spec().$container.find('thead tr:eq(0) th:eq(9)');

          $lastHeader.simulate('mousedown');
          $lastHeader.simulate('mouseup');
          $lastHeader.simulate('mousedown');

          $fistHeader.simulate('mouseover');
          $fistHeader.simulate('mousemove', {
            clientX: $fistHeader.offset().right - $fistHeader.width()
          });
          $fistHeader.simulate('mouseup');

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('J1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(9)').text()).toEqual('I1');
        });

        it('drag multiple columns from the left to the right', () => {
          handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          const $firstHeader = spec().$container.find('thead tr:eq(0) th:eq(0)');
          const $fourthHeader = spec().$container.find('thead tr:eq(0) th:eq(4)');

          selectColumns(0, 2);

          $firstHeader.simulate('mousedown');
          $firstHeader.simulate('mouseup');
          $firstHeader.simulate('mousedown');

          $fourthHeader.simulate('mouseover');
          $fourthHeader.simulate('mousemove');
          $fourthHeader.simulate('mouseup');

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('D1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('B1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(3)').text()).toEqual('C1');
        });

        it('drag multiple columns from the right to the left', () => {
          handsontable({
            data: Handsontable.helper.createSpreadsheetData(3, 10),
            colHeaders: true,
            manualColumnMove: true
          });

          const $fourthHeader = spec().$container.find('thead tr:eq(0) th:eq(3)');
          const $secondHeader = spec().$container.find('thead tr:eq(0) th:eq(1)');

          selectColumns(3, 5);

          $fourthHeader.simulate('mousedown');
          $fourthHeader.simulate('mouseup');
          $fourthHeader.simulate('mousedown');

          $secondHeader.simulate('mouseover');
          $secondHeader.simulate('mousemove');
          $secondHeader.simulate('mouseup');

          expect(spec().$container.find('tbody tr:eq(0) td:eq(0)').text()).toEqual('A1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(1)').text()).toEqual('D1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(2)').text()).toEqual('E1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(3)').text()).toEqual('F1');
          expect(spec().$container.find('tbody tr:eq(0) td:eq(4)').text()).toEqual('B1');
        });
      });

      it('should properly scrolling viewport if mouse is over part-visible cell', (done) => {
        const hot = handsontable({
          data: Handsontable.helper.createSpreadsheetData(20, 20),
          rowHeaders: true,
          colHeaders: true,
          manualColumnMove: true,
          width: 600,
          height: 600,
          rowHeights: 47
        });

        hot.selectCell(19, 0);

        setTimeout(() => {
          expect(hot.view.wt.wtTable.getFirstVisibleRow()).toBeGreaterThan(8);

          const $rowsHeaders = spec().$container.find('.ht_clone_left tr th');

          $rowsHeaders.eq(10).simulate('mousedown');
          $rowsHeaders.eq(10).simulate('mouseup');
          $rowsHeaders.eq(10).simulate('mousedown');
          $rowsHeaders.eq(8).simulate('mouseover');
          $rowsHeaders.eq(8).simulate('mousemove');
          $rowsHeaders.eq(8).simulate('mouseup');
        }, 50);

        setTimeout(() => {
          expect(hot.view.wt.wtTable.getFirstVisibleRow()).toBeLessThan(8);
          done();
        }, 150);
      });
    });
  });
});
