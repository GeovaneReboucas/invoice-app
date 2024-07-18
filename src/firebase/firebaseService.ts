import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, where } from 'firebase/firestore';
import moment from 'moment';

import { db } from '@/firebase/firebaseInit';
import type { BodyParams, FirebaseData, OrderBy, QueryParams } from './types';

class FirebaseService {
  constructor() { }

  _orderBy: OrderBy = {
    field: 'createdAt',
    direction: 'asc',
  };

  async findList(collectionName: string, queryParams: QueryParams = {}) {
    try {
      //Checks if there is ordering
      if (!queryParams.orderBy) {
        queryParams.orderBy = this._orderBy;
      }

      //Starting collectionDB and query
      const collectionDB = collection(db, collectionName);
      let collectionQuery = query(
        collectionDB,
        orderBy(
          queryParams.orderBy!.field,
          queryParams.orderBy!.direction
        )
      );

      //Checks if there is a where query
      const { searchBy } = queryParams;
      if (searchBy) {
        collectionQuery = query(
          collectionDB,
          orderBy(
            queryParams.orderBy!.field,
            queryParams.orderBy!.direction
          ),
          where(searchBy!.field, searchBy!.condicion, searchBy!.value)
        );
      }

      //Retrieving and returning documents
      const querySnapshot = await getDocs(collectionQuery);
      const data: FirebaseData[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) { console.error(error) }
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

  async save(collectionName: string, bodyParams: BodyParams) {
    const { id, ...rest } = bodyParams;

    if (!id) {
      return await addDoc(collection(db, collectionName), {
        ...rest,
        createdAt: moment().toISOString()
      });
    } else {
      const docRef = doc(db, collectionName, id)
      return await setDoc(docRef, {
        ...rest,
        updatedAt: moment().toISOString()
      });
    }
  }

  async delete(collectionName: string, id: string) {
    return await deleteDoc(doc(db, collectionName, id));
  }
}

const instance = new FirebaseService();
Object.freeze(instance);

export const firebaseService = instance;