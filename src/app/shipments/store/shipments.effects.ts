import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { ShipmentService } from '../../services/shipment-service';
import { Shipment } from './shipments.state';
import * as ShipmentsActions from './shipments.actions';

@Injectable()
export class ShipmentsEffects {
  private actions$ = inject(Actions);
  private shipmentService = inject(ShipmentService);
  
  // Load all shipments
  loadShipments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipmentsActions.loadShipments),
      tap((action) => console.log('🔄 Loading shipments with params:', action)),
      switchMap(({ page, pageSize }) =>
        this.shipmentService.getShipments().pipe(
          tap((shipments) => console.log('✅ Shipments loaded from API:', shipments)),
          map((shipments) => {
            const total = shipments.length;
            return ShipmentsActions.loadShipmentsSuccess({ 
              shipments, 
              total 
            });
          }),
          catchError((error) => {
            console.error('❌ Error loading shipments:', error);
            return of(ShipmentsActions.loadShipmentsFailure({ 
              error: error.message || 'Failed to load shipments' 
            }));
          })
        )
      )
    )
  );

  // Load single shipment
  loadShipment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipmentsActions.loadShipment),
      tap((action) => console.log('🔄 Loading shipment:', action.trackingNumber)),
      switchMap(({ trackingNumber }) =>
        this.shipmentService.getShipment(trackingNumber).pipe(
          tap((shipment) => console.log('✅ Shipment loaded:', shipment)),
          map((shipment) =>
            ShipmentsActions.loadShipmentSuccess({ shipment })
          ),
          catchError((error) => {
            console.error('❌ Error loading shipment:', error);
            return of(ShipmentsActions.loadShipmentFailure({ 
              error: error.message || 'Failed to load shipment' 
            }));
          })
        )
      )
    )
  );

  // Create shipment
  createShipment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipmentsActions.createShipment),
      tap((action) => console.log('🔄 Creating shipment:', action.shipment)),
      switchMap(({ shipment }) =>
        this.shipmentService.createShipment(shipment as Omit<Shipment, 'trackingNumber'>).pipe(
          tap((created) => console.log('✅ Shipment created:', created)),
          map((shipment) =>
            ShipmentsActions.createShipmentSuccess({ shipment })
          ),
          catchError((error) => {
            console.error('❌ Error creating shipment:', error);
            return of(ShipmentsActions.createShipmentFailure({ 
              error: error.message || 'Failed to create shipment' 
            }));
          })
        )
      )
    )
  );

  // Update shipment
  updateShipment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipmentsActions.updateShipment),
      tap((action) => console.log('🔄 Updating shipment:', action.trackingNumber, action.shipment)),
      switchMap(({ trackingNumber, shipment }) =>
        this.shipmentService.updateShipment(trackingNumber, shipment).pipe(
          tap((updated) => console.log('✅ Shipment updated:', updated)),
          map((shipment) =>
            ShipmentsActions.updateShipmentSuccess({ shipment })
          ),
          catchError((error) => {
            console.error('❌ Error updating shipment:', error);
            return of(ShipmentsActions.updateShipmentFailure({ 
              error: error.message || 'Failed to update shipment' 
            }));
          })
        )
      )
    )
  );

  // Delete shipment
  deleteShipment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ShipmentsActions.deleteShipment),
      tap((action) => console.log('🔄 Deleting shipment:', action.trackingNumber)),
      switchMap(({ trackingNumber }) =>
        this.shipmentService.deleteShipment(trackingNumber).pipe(
          tap(() => console.log('✅ Shipment deleted:', trackingNumber)),
          map(() =>
            ShipmentsActions.deleteShipmentSuccess({ trackingNumber })
          ),
          catchError((error) => {
            console.error('❌ Error deleting shipment:', error);
            return of(ShipmentsActions.deleteShipmentFailure({ 
              error: error.message || 'Failed to delete shipment' 
            }));
          })
        )
      )
    )
  );

  // Success messages
  successMessage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ShipmentsActions.createShipmentSuccess,
          ShipmentsActions.updateShipmentSuccess,
          ShipmentsActions.deleteShipmentSuccess
        ),
        tap((action) => console.log('✅ Success action:', action.type))
      ),
    { dispatch: false }
  );
}
