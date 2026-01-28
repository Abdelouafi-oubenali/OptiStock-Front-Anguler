import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { PurchaseOrderService } from './purchase-order.service';
import * as PoActions from './po.actions';
import { AppState } from '../store/po.state';

@Injectable()
export class PurchaseOrderEffects {
  private actions$ = inject(Actions);
  private poService = inject(PurchaseOrderService);
  private store = inject(Store<AppState>);

  // Load Purchase Orders
  loadPurchaseOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoActions.loadPurchaseOrders),
      mergeMap(({ filter }) =>
        this.poService.getPurchaseOrders(filter).pipe(
          map(orders => PoActions.loadPurchaseOrdersSuccess({ orders })),
          catchError(error => of(PoActions.loadPurchaseOrdersFailure({ error: error.message })))
        )
      )
    )
  );

  // Load Single Purchase Order
  loadPurchaseOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoActions.loadPurchaseOrder),
      mergeMap(({ id }) =>
        this.poService.getPurchaseOrderById(id).pipe(
          map(order => PoActions.loadPurchaseOrderSuccess({ order })),
          catchError(error => of(PoActions.loadPurchaseOrderFailure({ error: error.message })))
        )
      )
    )
  );

  // Create Purchase Order
  createPurchaseOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoActions.createPurchaseOrder),
      mergeMap(({ order }) =>
        this.poService.createPurchaseOrder(order).pipe(
          map(createdOrder => PoActions.createPurchaseOrderSuccess({ order: createdOrder })),
          catchError(error => of(PoActions.createPurchaseOrderFailure({ error: error.message })))
        )
      )
    )
  );

  // Update Purchase Order
  updatePurchaseOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoActions.updatePurchaseOrder),
      mergeMap(({ id, updates }) =>
        this.poService.updatePurchaseOrder(id, updates).pipe(
          map(updatedOrder => PoActions.updatePurchaseOrderSuccess({ order: updatedOrder })),
          catchError(error => of(PoActions.updatePurchaseOrderFailure({ error: error.message })))
        )
      )
    )
  );

  // Delete Purchase Order
  deletePurchaseOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoActions.deletePurchaseOrder),
      mergeMap(({ id }) =>
        this.poService.deletePurchaseOrder(id).pipe(
          map(() => PoActions.deletePurchaseOrderSuccess({ id })),
          catchError(error => of(PoActions.deletePurchaseOrderFailure({ error: error.message })))
        )
      )
    )
  );

  // Update Status
  updatePurchaseOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoActions.updatePurchaseOrderStatus),
      mergeMap(({ id, status }) =>
        this.poService.updateStatus(id, status).pipe(
          map(order => PoActions.updatePurchaseOrderStatusSuccess({ order })),
          catchError(error => of(PoActions.updatePurchaseOrderStatusFailure({ error: error.message })))
        )
      )
    )
  );

  // Bulk Update Status
  bulkUpdatePurchaseOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoActions.bulkUpdatePurchaseOrderStatus),
      mergeMap(({ ids, status }) =>
        this.poService.bulkUpdateStatus(ids, status).pipe(
          map(orders => PoActions.bulkUpdatePurchaseOrderStatusSuccess({ orders })),
          catchError(error => of(PoActions.bulkUpdatePurchaseOrderStatusFailure({ error: error.message })))
        )
      )
    )
  );

  // Success Actions (could trigger reloads or navigation)
  createSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoActions.createPurchaseOrderSuccess),
      map(() => PoActions.loadPurchaseOrders({}))
    )
  );

  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoActions.updatePurchaseOrderSuccess, PoActions.updatePurchaseOrderStatusSuccess),
      map(({ order }) => PoActions.loadPurchaseOrder({ id: order.id! }))
    )
  );

  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PoActions.deletePurchaseOrderSuccess),
      map(() => PoActions.loadPurchaseOrders({}))
    )
  );
}
