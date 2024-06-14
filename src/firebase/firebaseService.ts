import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, type OrderByDirection } from 'firebase/firestore';
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

class FirebaseService {
  constructor() {}

  _orderBy: OrderBy = {
    field: 'createdAt',
    direction: 'asc',
  };

  async findList(collectionName: string, queryParams: QueryParams = {}){
    try{
      if(queryParams && !queryParams.orderBy){
        queryParams.orderBy = this._orderBy;
      }

      return new Promise((resolve) => {
        const collRefQuery = query(
          collection(db, collectionName),
          orderBy(queryParams.orderBy!.field, queryParams.orderBy!.direction)
        );
        const unsub = onSnapshot(collRefQuery, (snapShot) => {
          const data = snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          resolve(data);
        });
        return () => unsub();
      });
    }catch(error){ console.error(error) }
  }

  async save(collectionName: string, bodyParams: BodyParams = {}){
    const {id, ...rest} = bodyParams;

    if(!id){
      return await addDoc(collection(db, collectionName), {
        ...rest,
        createdAt: moment().toISOString()
      });
    }else{
      const docRef = doc(db, collectionName, id)
      const resp = await setDoc(docRef, {
        ...rest,
        updatedAt: moment().toISOString()
      });
      return resp;
    }
  }
}

const instance = new FirebaseService();
Object.freeze(instance);

export const firebaseService = instance;