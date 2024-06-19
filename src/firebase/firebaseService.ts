import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, type OrderByDirection } from 'firebase/firestore';
import { db } from '@/firebase/firebaseInit';
import moment from 'moment';

type OrderBy = {
  field: string;
  direction: OrderByDirection;
};

type QueryParams = {
  id?: string;
  searchBy?: {
    field: string;
    value: string | number;
  };
  orderBy?: OrderBy;
}

type BodyParams = {
  id?: string;
  [key: string]: any;
}

type FirebaseData = {
  id: string;
  [key: string]: any;
}

class FirebaseService {
  constructor() {}

  _orderBy: OrderBy = {
    field: 'createdAt',
    direction: 'asc',
  };

  async findList(collectionName: string, queryParams: QueryParams = {}){
    try{
      if(!queryParams.orderBy){
        queryParams.orderBy = this._orderBy;
      }

      const collectionDB = collection(db, collectionName);
      const collectionQuery = query(collectionDB, orderBy(
        queryParams.orderBy!.field,
        queryParams.orderBy!.direction
      ));
      const querySnapshot = await getDocs(collectionQuery);
      const data: FirebaseData[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    }catch(error){ console.error(error) }
  }

  async findById(collectionName: string, id: string) {
    return new Promise<FirebaseData>((resolve) => {
      const documentRef = doc(db, collectionName, id);
      const unsub = onSnapshot(documentRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = { id: docSnapshot.id, ...docSnapshot.data() };
          resolve(data);
        }
      });
      return () => unsub();
    });
  };

  async save(collectionName: string, bodyParams: BodyParams){
    const {id, ...rest} = bodyParams;

    if(!id){
      return await addDoc(collection(db, collectionName), {
        ...rest,
        createdAt: moment().toISOString()
      });
    }else{
      const docRef = doc(db, collectionName, id)
      return await setDoc(docRef, {
        ...rest,
        updatedAt: moment().toISOString()
      });
    }
  }

  async delete(collectionName: string, id: string){
    return await deleteDoc(doc(db, collectionName, id));
  }
}

const instance = new FirebaseService();
Object.freeze(instance);

export const firebaseService = instance;