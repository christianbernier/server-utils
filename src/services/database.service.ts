import { cert, initializeApp } from 'firebase-admin/app';
import { Firestore, WriteResult, getFirestore } from 'firebase-admin/firestore';
import { EnvService } from './env.service';

interface IDatabaseService {
  saveEntry(
    collection: string,
    document: string,
    data: object
  ): Promise<WriteResult>;
}

export class DatabaseService implements IDatabaseService {
  private static readonly singleton = new DatabaseService();
  private readonly firestore: Firestore;

  /**
   * @description Initialize the Firestore database.
   * @private
   */
  private constructor() {
    initializeApp({
      credential: cert({
        projectId: EnvService.of().getVar('FIREBASE_PROJECT_ID'),
        privateKey: EnvService.of().getVar('FIREBASE_PRIVATE_KEY'),
        clientEmail: EnvService.of().getVar('FIREBASE_CLIENT_EMAIL'),
      }),
    });

    this.firestore = getFirestore();
  }

  /**
   * @description Gets the singleton instance of this service.
   * @returns An instance of the service.
   */
  public static of(): DatabaseService {
    return DatabaseService.singleton;
  }

  public async saveEntry(
    collection: string,
    document: string,
    data: object
  ): Promise<WriteResult> {
    return await this.firestore.collection(collection).doc(document).set(data);
  }
}
