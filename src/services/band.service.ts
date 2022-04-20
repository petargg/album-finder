import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, filter, map, tap } from 'rxjs/operators';
import { IBand } from "src/Infrastructure/band.model";
import { ISearchModel } from "src/Infrastructure/search.model";

@Injectable({
  providedIn: 'root'
})

export class BandService {
 
    constructor(private http: HttpClient) { }
  
    getBandAlbums(bandName: string): Observable<IBand[]> {

        if(bandName && bandName !== ''){
            return this.http.get<ISearchModel>(`https://itunes.apple.com/search?term=${bandName}`).pipe(
                //tap(data => console.log('All', JSON.stringify(data.results))),
                map((res: ISearchModel) => 

                res.results
                .filter((value, index, arr) =>{
                    return value.collectionName && 
                    value.collectionName != '' &&
                    arr.findIndex(val => val.collectionName === value.collectionName) === index
                }) 
                .sort((a, b) => {
                    return a.collectionName.toLowerCase().localeCompare(b.collectionName.toLowerCase())
                })
                .slice(0, 5)
                ),
                catchError(this.handleError)
              );
        }

        return of([
            {collectionName: 'A'},
            {collectionName: 'B'},
            {collectionName: 'C'},
            {collectionName: 'D'},
            {collectionName: 'E'}
        ]);
    }
  
    // // Get one product
    // // Since we are working with a json file, we can only retrieve all products
    // // So retrieve all products and then find the one we want using 'map'
    // getProduct(id: number): Observable<IProduct | undefined> {
    //   return this.getProducts()
    //     .pipe(
    //       map((products: IProduct[]) => products.find(p => p.productId === id))
    //     );
    // }
  
      private handleError(err: HttpErrorResponse): Observable<never> {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          errorMessage = `An error occurred: ${err.error.message}`;
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
      }
  }