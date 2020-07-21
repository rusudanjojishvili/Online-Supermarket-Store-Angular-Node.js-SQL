import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AdminService {


  constructor(public http:HttpClient) { }

  public addProduct(body){
    return this.http.post("http://localhost:1000/admin/addProduct",body,{
      headers:{'Content-Type':'application/json','token':sessionStorage.token},
      responseType:"text"
   })
  }
  public updateProduct(id,body){
    return this.http.put("http://localhost:1000/admin/updateProduct/"+id,body,{
      headers:{'Content-Type':'application/json','token':sessionStorage.token},
      responseType:"text"
    })
  }
  public uploadImage(image:any): Observable<any> {
    const formData = new FormData();

    formData.append('image', image);
   

    return this.http.post('http://localhost:1000/upload', formData,{
      headers:{'token':sessionStorage.token},
      responseType:"text",
      reportProgress:true,
      observe:'events'
    });
  }
  


}
